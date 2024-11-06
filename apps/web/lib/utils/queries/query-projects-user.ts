import { ProjectsUserServiceBase } from "@repo/nest";

import { webAPI } from "@api/web";
import { User } from "@repo/database";

export const queryProjectsUser = async (userId: User["id"]) => {
  return webAPI.get<
    Awaited<ReturnType<ProjectsUserServiceBase["getProjectUsers"]>>
  >(`/projects/users/${userId}`, {
    cache: "no-cache",
  });
};
