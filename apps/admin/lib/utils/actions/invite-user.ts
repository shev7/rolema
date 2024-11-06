"use server";

import { redirect } from "next/navigation";

import { InviteUserSchema } from "@repo/validation";
import constants from "@repo/constants";
import { UsersServiceBase } from "@repo/nest";

import { adminAPI } from "@api/admin";

export const inviteUser = async (values: InviteUserSchema) => {
  const { id } = await adminAPI.post<
    Awaited<ReturnType<UsersServiceBase["inviteCreatorUser"]>>
  >(`/users/invite`, values);

  redirect(constants.nav.routes.userInfo(id));
};
