import { cookies } from "next/headers";

import { getSession } from "@repo/utils";

import { webAPI } from "@api/web";
import { UserServiceBase } from "@repo/nest";

export type CurrentUser = Awaited<ReturnType<UserServiceBase["getUser"]>>;

export const queryCurrentUser = async () => {
  const session = await getSession(cookies());

  if (!session.user_id) {
    return null;
  }

  return webAPI.get<CurrentUser>(`/users/${session.user_id}`, {
    cache: "no-cache",
  });
};
