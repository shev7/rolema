"use server";

import { InviteUserToProjectSchema } from "@repo/validation";
import { User } from "@repo/database";

import { webAPI } from "@api/web";

export const inviteUser = (values: InviteUserToProjectSchema) => {
  return webAPI.post<User>("/users/invite", values);
};
