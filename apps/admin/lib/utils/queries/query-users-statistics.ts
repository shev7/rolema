import { adminAPI } from "@api/admin";
import { UsersServiceBase } from "@repo/nest";

export const queryUsersStatistics = () => {
  return adminAPI.get<
    Awaited<ReturnType<UsersServiceBase["getUsersStatistic"]>>
  >(`/users/statistics`, {
    cache: "no-cache",
  });
};
