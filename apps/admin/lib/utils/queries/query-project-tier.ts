import { adminAPI } from "@api/admin";
import { ProjectServiceBase } from "@repo/nest";

export const queryProjectTier = (
  projectId: Parameters<ProjectServiceBase["getProjectTier"]>[0],
) => {
  return adminAPI.get<
    Awaited<ReturnType<ProjectServiceBase["getProjectTier"]>>
  >(`/projects/${projectId}/tier`, {
    cache: "no-cache",
  });
};
