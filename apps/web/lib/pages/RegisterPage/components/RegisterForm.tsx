"use client";

import { useRouter } from "next/navigation";

import { Button, Flex, Form, PasswordInput, useToast } from "@repo/ui";
import { useMutation } from "@repo/utils";
import { RegisterSchema, registerSchema } from "@repo/validation";
import { useTranslation } from "@repo/i18n/hooks";
import constants from "@repo/constants";

import { register } from "@actions/register";

type RegisterFormProps = {
  token: string;
};

export const RegisterForm = ({ token }: RegisterFormProps) => {
  const defaultValues: RegisterSchema = {
    token,
    password: "",
  };

  const { t } = useTranslation("common");
  const router = useRouter();

  const toast = useToast();

  const { isLoading, mutate } = useMutation(register, {
    onSuccess: () => {
      router.replace(constants.nav.routes.home);
    },
    onError: (error) => {
      toast.error({ title: error.message });
    },
  });

  return (
    <Form
      onSubmit={mutate}
      schema={registerSchema}
      defaultValues={defaultValues}
      style={{ width: "400px" }}
    >
      <Flex gap="4" direction="column">
        <PasswordInput
          label={t("password")}
          placeholder={t("password")}
          style={{ flexGrow: 1 }}
        />
        <Button
          variant="surface"
          type="submit"
          loading={isLoading}
          disabled={isLoading}
        >
          {t("register")}
        </Button>
      </Flex>
    </Form>
  );
};
