import { adminAPI } from "@api/admin";
import { ProjectsServiceBase } from "@repo/nest";

export const queryProjectsStatistics = () => {
  return adminAPI.get<
    Awaited<ReturnType<ProjectsServiceBase["getStatistics"]>>
  >(`/projects/statistics`, {
    cache: "no-cache",
  });
};
