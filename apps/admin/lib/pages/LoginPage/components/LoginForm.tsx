"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Button, Flex, Form, FormInput, useToast } from "@repo/ui";
import { useMutation } from "@repo/utils";
import { LoginSchema, loginSchema } from "@repo/validation";
import { useTranslation } from "@repo/i18n/hooks";
import constants from "@repo/constants";

import { login } from "@actions/login";

const defaultValues: LoginSchema = {
  email: "",
  password: "",
};

export const LoginForm = () => {
  const router = useRouter();
  const { t } = useTranslation("common");
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
      toast.error({ title: error.message ?? t("something went wrong") });
    },
  });

  return (
    <Form
      onSubmit={mutate}
      schema={loginSchema}
      defaultValues={defaultValues}
      style={{ width: "30rem" }}
    >
      <Flex gap="4" width="30rem" direction="column">
        <FormInput
          label={t("email")}
          placeholder={t("email")}
          name="email"
          type="email"
        />
        <FormInput
          label={t("password")}
          placeholder={t("password")}
          name="password"
          type="password"
        />
        <Button
          variant="surface"
          type="submit"
          loading={isLoading}
          disabled={isLoading}
        >
          {t("login")}
        </Button>
      </Flex>
    </Form>
  );
};
