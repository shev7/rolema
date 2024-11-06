"use server";

import { revalidatePath } from "next/cache";

import { Permission, ProjectRole } from "@repo/database";
import constants from "@repo/constants";

import { webAPI } from "@api/web";

export const updateProjectRolePermissions = async ({
  id,
  permissions,
}: {
  id: ProjectRole["id"];
  permissions: Array<
    { key: Permission["key"] } & (
      | {
          project_id: NonNullable<Permission["project_id"]>;
        }
      | {
          project_role_id: NonNullable<Permission["project_role_id"]>;
        }
    )
  >;
}) => {
  const response = await webAPI.patch<Array<ProjectRole>>(
    `/projects/roles/${id}/permissions`,
    {
      permissions,
    },
  );

  if (response.length > 0) {
    revalidatePath(
      constants.nav.routes.projectRolePermissions(id, response[0]!.project_id),
    );
  }

  return response;
};
