import {
  QueryProjectRolesProps,
  QueryProjectRolesReturnType,
} from "@repo/database";
import constants from "@repo/constants";

import { webAPI } from "@api/web";
import { arrayToSearchParams } from "@repo/utils";

export const queryProjectRoles = ({
  projectId,
  excludeProjectRoleIds,
}: QueryProjectRolesProps) => {
  const searchParams = arrayToSearchParams(
    excludeProjectRoleIds ?? [],
    constants.nav.sp.keys.excludeProjectRoleId,
  ).toString();

  return webAPI.get<QueryProjectRolesReturnType>(
    `/projects/${projectId}/roles${searchParams ? `?${searchParams}` : ""}`,
  );
};
