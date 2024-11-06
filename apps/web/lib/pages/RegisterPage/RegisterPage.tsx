import { redirect } from "next/navigation";

import { registerSchema } from "@repo/validation";
import { Flex } from "@repo/ui";
import { NextPageProps } from "@repo/types";
import constants from "@repo/constants";

import { RegisterForm } from "./components/RegisterForm";

export const RegisterPage = ({
  searchParams: { token },
}: NextPageProps<{
  token?: string;
}>) => {
  const { success, data } = registerSchema.shape.token.safeParse(token);

  if (!success || !data) {
    return redirect(constants.nav.routes.home);
  }

  return (
    <Flex p="6" height="100%" justify="center">
      <RegisterForm token={data} />
    </Flex>
  );
};
