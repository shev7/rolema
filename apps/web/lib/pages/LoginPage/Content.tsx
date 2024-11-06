"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  Button,
  Flex,
  Form,
  Typography,
  FormInput,
  Box,
  PasswordInput,
  useToast,
} from "@repo/ui";
import { useMutation } from "@repo/utils";
import { LoginSchema, loginSchema } from "@repo/validation";
import { useTranslation } from "@repo/i18n/hooks";
import constants from "@repo/constants";

import { login } from "@actions/login";

const defaultValues: LoginSchema = {
  email: "",
  password: "",
};

export const Content = () => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const { t: webT } = useTranslation("web");
  const searchParams = useSearchParams();

  const toast = useToast();

  const { isLoading, mutate } = useMutation(login, {
    onSuccess: () => {
      router.replace(
        searchParams.get(constants.nav.sp.keys.url) ||
          constants.nav.routes.home,
      );
    },
    onError: (error) => {
      toast.error({ title: error.message });
    },
  });

  return (
    <Box p="6" height="100vh">
      <Flex align="center" justify="center" height="100%">
        <Form
          onSubmit={mutate}
          schema={loginSchema}
          defaultValues={defaultValues}
          style={{ width: "20rem" }}
        >
          <Flex gap="4" direction="column">
            <Typography align="center" size="6">
              {webT("log in to rolema")}
            </Typography>
            <FormInput
              label={t("email")}
              placeholder={t("email")}
              name="email"
              type="email"
            />
            <PasswordInput label={t("password")} placeholder={t("password")} />
            <Button
              variant="surface"
              type="submit"
              loading={isLoading}
              disabled={isLoading}
            >
              {t("continue")}
            </Button>
          </Flex>
        </Form>
      </Flex>
    </Box>
  );
};
