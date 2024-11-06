import { ProjectRole } from "@repo/database";
import { CountResponse } from "@repo/types";

import { webAPI } from "@api/web";

export const queryProjectRoleUsersCount = (
  projectRoleId: ProjectRole["id"],
) => {
  return webAPI.get<CountResponse>(
    `/projects/roles/${projectRoleId}/users/count`,
    { cache: "no-cache" },
  );
};
