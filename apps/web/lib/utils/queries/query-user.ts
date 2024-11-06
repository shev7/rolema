import { webAPI } from "@api/web";

import { User } from "@repo/database";
import { UserServiceBase } from "@repo/nest";

export const queryUser = (userId: User["id"]) => {
  return webAPI.get<Awaited<ReturnType<UserServiceBase["getUser"]>>>(
    `/users/${userId}`,
    {
      cache: "no-cache",
    },
  );
};
