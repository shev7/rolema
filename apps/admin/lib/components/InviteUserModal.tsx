"use client";
import { useState } from "react";

import {
  Box,
  Button,
  Dialog,
  DialogProps,
  Flex,
  Form,
  FormInput,
  useToast,
} from "@repo/ui";
import { useMutation } from "@repo/utils";
import { inviteUserSchema } from "@repo/validation";
import { useTranslation } from "@repo/i18n/hooks";
import constants from "@repo/constants";
import { QueryTiersReturnType } from "@repo/database";

import { inviteUser } from "@actions/invite-user";

import { ProjectForm } from "./ProjectForm";

export type InviteUserModalProps = DialogProps & {
  tiers: QueryTiersReturnType;
};

export const InviteUserModal = ({ tiers, ...props }: InviteUserModalProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const { t } = useTranslation();
  const { t: tAdmin } = useTranslation("admin");

  const [step, setStep] = useState<0 | 1>(0);

  const toast = useToast();

  const { isLoading, mutate } = useMutation(inviteUser, {
    onError: (error) => {
      toast.error({ title: error.message });
    },
  });

  return (
    <Dialog
      onOpenChange={(state) => {
        setOpen(state);

        if (!state) {
          setStep(0);
        }
      }}
      open={open}
      {...props}
    >
      <Box>
        <Button onClick={() => setOpen(true)}>{t("invite")}</Button>
      </Box>
      <Dialog.Content maxWidth="400px">
        <Dialog.Title>
          {`${t("invite user")}. Step ${step + 1} / 2 ${step === 0 ? t("user") : t("project")}`}
        </Dialog.Title>
        <Form
          onSubmit={mutate}
          onInvalid={(fields) => {
            if ("email" in fields) {
              setStep(0);
            }
          }}
          schema={inviteUserSchema}
          defaultValues={{
            email: "",
            project: {
              name: "",
              description: "",
            },
            project_tier: {
              tier_id: tiers.length === 1 ? tiers[0]!.id : "",
              duration: constants.database.tier.day_durations[0],
            },
          }}
        >
          <Flex gap="4" direction="column">
            {step === 0 && (
              <FormInput
                label={t("email")}
                placeholder={tAdmin("email of creator")}
                type="email"
                name="email"
              />
            )}
            {step === 1 && (
              <ProjectForm users={[]} type="create" tiers={tiers} />
            )}
          </Flex>
          <Flex gap="3" mt="4" justify="end">
            {step === 0 && (
              <>
                <Dialog.Close>
                  <Button
                    variant="soft"
                    color="gray"
                    type="button"
                    disabled={isLoading}
                  >
                    {t("cancel")}
                  </Button>
                </Dialog.Close>
                <Button
                  variant="surface"
                  type="button"
                  onClick={() => setStep((s) => (s === 0 ? 1 : 0))}
                  disabled={isLoading}
                >
                  {t("continue")}
                </Button>
              </>
            )}

            {step === 1 && (
              <>
                <Button
                  variant="soft"
                  color="gray"
                  type="submit"
                  loading={isLoading}
                  disabled={isLoading}
                  onClick={() => setStep(0)}
                >
                  {t("back")}
                </Button>
                <Button
                  variant="surface"
                  type="submit"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {t("invite")}
                </Button>
              </>
            )}
          </Flex>
        </Form>
      </Dialog.Content>
    </Dialog>
  );
};
