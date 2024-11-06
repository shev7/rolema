import { adminAPI } from "@api/admin";
import { Project } from "@repo/database";
import { ProjectUsersServiceBase } from "@repo/nest";

export const queryProjectUsersCount = (projectId: Project["id"]) => {
  return adminAPI.get<
    Awaited<ReturnType<ProjectUsersServiceBase["getProjectUsersCount"]>>
  >(`/projects/${projectId}/users/count`, {
    cache: "no-cache",
  });
};
