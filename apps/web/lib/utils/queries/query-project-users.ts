import { Project } from "@repo/database";
import { ProjectUsersServiceBase } from "@repo/nest";

import { webAPI } from "@api/web";

export const queryProjectUsers = (projectId: Project["id"]) => {
  return webAPI.get<
    Awaited<ReturnType<ProjectUsersServiceBase["getProjectUsers"]>>
  >(`/projects/${projectId}/users`, {
    cache: "no-cache",
  });
};
