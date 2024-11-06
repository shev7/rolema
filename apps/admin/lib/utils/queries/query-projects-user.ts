import { adminAPI } from "@api/admin";
import { ProjectUser } from "@repo/database";
import { ProjectsUserServiceBase } from "@repo/nest";

export const queryProjectsUser = (userId: ProjectUser["user_id"]) => {
  return adminAPI.get<
    Awaited<ReturnType<ProjectsUserServiceBase["getProjectUsers"]>>
  >(`/projects/users/${userId}`, {
    cache: "no-cache",
  });
};
