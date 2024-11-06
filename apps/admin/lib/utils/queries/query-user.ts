import { adminAPI } from "@api/admin";

import { User } from "@repo/database";
import { UserServiceBase } from "@repo/nest";

export const queryUser = (userId: User["id"]) => {
  return adminAPI.get<Awaited<ReturnType<UserServiceBase["getUser"]>>>(
    `/users/${userId}`,
    {
      cache: "no-cache",
    },
  );
};
