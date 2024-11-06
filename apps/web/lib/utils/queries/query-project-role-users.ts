import { ProjectRole, QueryProjectUsersReturnType } from "@repo/database";

import { webAPI } from "@api/web";

export const queryProjectRoleUsers = (projectRoleId: ProjectRole["id"]) => {
  return webAPI.get<QueryProjectUsersReturnType>(
    `/projects/roles/${projectRoleId}/users`,
    { cache: "no-cache" },
  );
};
