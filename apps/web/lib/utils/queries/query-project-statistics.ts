import { Project } from "@repo/database";
import { ProjectServiceBase } from "@repo/nest";

import { webAPI } from "@api/web";

export type ProjectStatistics = Awaited<
  ReturnType<ProjectServiceBase["getProjectStatistics"]>
>;

export const queryProjectStatistics = (projectId: Project["id"]) => {
  return webAPI.get<ProjectStatistics>(`/projects/${projectId}/statistics`, {
    cache: "no-cache",
  });
};
