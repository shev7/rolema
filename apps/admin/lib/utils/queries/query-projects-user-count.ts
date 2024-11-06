import { adminAPI } from "@api/admin";
import { ProjectUser } from "@repo/database";
import { ProjectsUserServiceBase } from "@repo/nest";

export const queryProjectsUserCount = (userId: ProjectUser["user_id"]) => {
  return adminAPI.get<
    Awaited<ReturnType<ProjectsUserServiceBase["getProjectUsersCount"]>>
  >(`/projects/users/${userId}/count`, {
    cache: "no-cache",
  });
};
