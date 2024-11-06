import { adminAPI } from "@api/admin";
import { Project } from "@repo/database";
import { ProjectUsersServiceBase } from "@repo/nest";

export const queryProjectUsers = (
  projectId: Project["id"],
  urlSearchParams: URLSearchParams,
) => {
  return adminAPI.get<
    Awaited<ReturnType<ProjectUsersServiceBase["getProjectUsers"]>>
  >(
    `/projects/${projectId}/users${urlSearchParams.toString().length ? `?${urlSearchParams}` : ""}`,
    {
      cache: "no-cache",
    },
  );
};
