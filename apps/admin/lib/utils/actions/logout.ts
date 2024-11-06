"use server";

import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

import { getSession } from "@repo/utils";
import constants from "@repo/constants";

export const logout = async () => {
  const session = await getSession(cookies());

  session.destroy();

  redirect(constants.nav.routes.login, RedirectType.replace);
};
