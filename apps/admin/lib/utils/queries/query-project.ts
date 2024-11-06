import { adminAPI } from "@api/admin";
import { ProjectServiceBase } from "@repo/nest";

export const queryProject = ({
  projectId,
}: Parameters<ProjectServiceBase["getProject"]>[0]) => {
  return adminAPI.get<Awaited<ReturnType<ProjectServiceBase["getProject"]>>>(
    `/projects/${projectId}`,
    {
      cache: "no-cache",
    },
  );
};
