"use server";

import { UpdateProjectStatusSchema } from "@repo/validation";
import { Project } from "@repo/database";

import { adminAPI } from "@api/admin";
import { ProjectServiceBase } from "@repo/nest";

export const updateProjectStatus = (
  values: UpdateProjectStatusSchema & { id: Project["id"] },
) => {
  return adminAPI.patch<
    Awaited<ReturnType<ProjectServiceBase["updateProjectStatus"]>>
  >(`/projects/${values.id}/status`, values);
};
