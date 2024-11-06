"use server";

import { UpdateProjectSchema } from "@repo/validation";
import { Project } from "@repo/database";
import { ProjectServiceBase } from "@repo/nest";

import { adminAPI } from "@api/admin";

export const updateProject = ({
  id,
  ...values
}: UpdateProjectSchema & { id: Project["id"] }) => {
  return adminAPI.patch<
    Awaited<ReturnType<ProjectServiceBase["updateProject"]>>
  >(`/projects/${id}`, values);
};
