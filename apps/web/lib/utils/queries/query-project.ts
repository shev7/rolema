import { Project } from "@repo/database";
import { ProjectServiceBase } from "@repo/nest";

import { webAPI } from "@api/web";

export const queryProject = (projectId: Project["id"]) => {
  return webAPI.get<Awaited<ReturnType<ProjectServiceBase["getProject"]>>>(
    `/projects/${projectId}`,
    {
      cache: "no-cache",
    },
  );
};
