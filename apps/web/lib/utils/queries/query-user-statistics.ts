import { webAPI } from "@api/web";
import { User } from "@repo/database";
import { UserServiceBase } from "@repo/nest";

export const queryUserStatistics = (userId: User["id"]) => {
  return webAPI.get<Awaited<ReturnType<UserServiceBase["getUserStatistics"]>>>(
    `/users/${userId}/statistics`,
    {
      cache: "no-cache",
    },
  );
};
