import { webAPI } from "@api/web";
import { Project } from "@repo/database";
import { ProjectPermissionsServiceBase } from "@repo/nest";

export const queryProjectPermissions = (projectId: Project["id"]) => {
  return webAPI.get<
    Awaited<ReturnType<ProjectPermissionsServiceBase["getProjectPermissions"]>>
  >(`/projects/${projectId}/permissions`);
};
