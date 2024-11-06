"use server";

import { redirect } from "next/navigation";

import { DeleteUserSchema } from "@repo/validation";
import constants from "@repo/constants";

import { adminAPI } from "@api/admin";

export const deleteUser = async (values: DeleteUserSchema) => {
  await adminAPI.delete(`/users/${values.id}`);
  redirect(constants.nav.routes.users());
};
