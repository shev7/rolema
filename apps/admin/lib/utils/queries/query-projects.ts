import { ProjectsServiceBase } from "@repo/nest";

import { adminAPI } from "@api/admin";

export const queryProjects = () => {
  return adminAPI.get<Awaited<ReturnType<ProjectsServiceBase["getProjects"]>>>(
    `/projects`,
    {
      cache: "no-cache",
    },
  );
};
