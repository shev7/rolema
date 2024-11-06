"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Tier } from "@repo/database";
import { useTranslation } from "@repo/i18n/hooks";
import {
  Button,
  Dialog,
  Flex,
  Form,
  FormInput,
  FormStringArray,
  TextArea,
  useToast,
} from "@repo/ui";
import { useMutation, useOpen } from "@repo/utils";
import { updateTierSchema } from "@repo/validation";
import constants from "@repo/constants";

import { updateTier } from "@actions/update-tier";

export type EditTierModalProps = {
  tier: Tier;
};

export const EditTierModal = ({ tier }: EditTierModalProps) => {
  const { t } = useTranslation();
  const { t: adminT } = useTranslation("admin");

  const router = useRouter();

  const [isOpen, onOpen, onClose] = useOpen();

  const [step, setStep] = useState<0 | 1>(0);

  const toast = useToast();

  const { isLoading, mutate } = useMutation(updateTier, {
    onSuccess: () => {
      toast.success({ title: adminT("tier successfully updated") });
      onClose();
      setStep(0);
      router.refresh();
    },
    onError: (error) => {
      toast.error({ title: adminT(error.message) ?? t(error.message) });
    },
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(state) => (state ? onOpen() : onClose())}
    >
      <Dialog.Trigger>
        <Button disabled={isLoading}>{t("edit")}</Button>
      </Dialog.Trigger>
      <Dialog.Content maxWidth="400px">
        <Dialog.Title>
          {adminT("edit tier")} {step + 1} / 2
        </Dialog.Title>

        <Form
          onSubmit={(values) => mutate({ ...values, id: tier.id })}
          schema={updateTierSchema}
          defaultValues={{
            name: tier.name,
            description: tier.description,
            benefits: tier.benefits.length ? tier.benefits : ["First benefit"],
          }}
          onInvalid={(fields) => {
            if ("name" in fields || "description" in fields) {
              setStep(0);
            }
          }}
        >
          <Flex gap="4" direction="column">
            {step === 0 && (
              <>
                <FormInput
                  label={t("name")}
                  placeholder={t("name")}
                  name="name"
                  type="text"
                  minLength={constants.database.tier.name.minLength}
                  maxLength={constants.database.tier.name.maxLength}
                />
                <TextArea
                  label={t("description")}
                  placeholder={t("description")}
                  name="description"
                  minLength={constants.database.tier.description.minLength}
                  maxLength={constants.database.tier.description.maxLength}
                />
              </>
            )}
            {step === 1 && (
              <FormStringArray
                name="benefits"
                label={t("benefits")}
                style={{ width: "100%" }}
              />
            )}
          </Flex>
          <Flex gap="3" mt="4" justify="end">
            {step === 0 && (
              <>
                <Dialog.Close>
                  <Button variant="soft" color="gray" type="button">
                    {t("cancel")}
                  </Button>
                </Dialog.Close>
                <Button type="button" onClick={() => setStep(1)}>
                  {t("continue")}
                </Button>
              </>
            )}
            {step === 1 && (
              <>
                <Button
                  variant="soft"
                  color="gray"
                  type="button"
                  onClick={() => setStep(0)}
                  disabled={isLoading}
                >
                  {t("back")}
                </Button>
                <Button disabled={isLoading} loading={isLoading} type="submit">
                  {t("save")}
                </Button>
              </>
            )}
          </Flex>
        </Form>
      </Dialog.Content>
    </Dialog>
  );
};
