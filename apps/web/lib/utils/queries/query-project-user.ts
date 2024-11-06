import { Project, User } from "@repo/database";
import { ProjectUserServiceBase } from "@repo/nest";

import { webAPI } from "@api/web";

export const queryProjectUser = async (
  projectId: Project["id"],
  userId: User["id"],
) => {
  try {
    return await webAPI.get<
      Awaited<ReturnType<ProjectUserServiceBase["getProjectsUser"]>>
    >(`/projects/${projectId}/users/${userId}`, {
      cache: "no-cache",
    });
  } catch {
    return null;
  }
};
