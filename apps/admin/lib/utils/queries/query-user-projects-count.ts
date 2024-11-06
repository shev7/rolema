import { adminAPI } from "@api/admin";

import { User } from "@repo/database";
import { UserProjectsServiceBase } from "@repo/nest";

export const queryUserProjectsCount = (userId: User["id"]) => {
  return adminAPI.get<
    Awaited<ReturnType<UserProjectsServiceBase["getProjectsCount"]>>
  >(`/users/${userId}/projects/count`, {
    cache: "no-cache",
  });
};
