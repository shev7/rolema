import { adminAPI } from "@api/admin";

import { User } from "@repo/database";
import { UserProjectsServiceBase } from "@repo/nest";

export const queryUserProjects = (userId: User["id"]) => {
  return adminAPI.get<
    Awaited<ReturnType<UserProjectsServiceBase["getProjects"]>>
  >(`/users/${userId}/projects`, {
    cache: "no-cache",
  });
};
