"use server";

import { ProjectRole } from "@repo/database";
import constants from "@repo/constants";

import { webAPI } from "@api/web";

export type DeleteProjectRoleVariables = {
  projectRoleId: ProjectRole["id"];
  fallbackRoleId?: ProjectRole["id"];
};

export const deleteProjectRole = ({
  fallbackRoleId,
  projectRoleId,
}: DeleteProjectRoleVariables) => {
  const params = fallbackRoleId
    ? new URLSearchParams({
        [constants.nav.sp.keys.fallbackRoleId]: fallbackRoleId,
      }).toString()
    : "";

  return webAPI.delete(
    `/projects/roles/${projectRoleId}${params && `?${params}`}`,
  );
};
