"use server";

import { UpdateProjectRoleSchema } from "@repo/validation";
import { ProjectRole } from "@repo/database";

import { webAPI } from "@api/web";

export const updateProjectRole = ({
  id,
  ...values
}: UpdateProjectRoleSchema & { id: ProjectRole["id"] }) => {
  return webAPI.patch<ProjectRole>(`/projects/roles/${id}`, values);
};
