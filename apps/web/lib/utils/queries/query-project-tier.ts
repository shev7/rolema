import { Project } from "@repo/database";
import { ProjectTierServiceBase } from "@repo/nest";

import { webAPI } from "@api/web";

export const queryProjectTier = (projectId: Project["id"]) => {
  return webAPI.get<
    Awaited<ReturnType<ProjectTierServiceBase["getProjectTier"]>>
  >(`/projects/${projectId}/tier`, {
    cache: "no-cache",
  });
};
