"use server";

import { CreateProjectRoleSchema } from "@repo/validation";
import { ProjectRole } from "@repo/database";
import constants from "@repo/constants";

import { webAPI } from "@api/web";
import { revalidatePath } from "next/cache";

export const createProjectRole = async (values: CreateProjectRoleSchema) => {
  const response = await webAPI.post<ProjectRole>(`/projects/roles`, values);

  revalidatePath(constants.nav.routes.projectRoles(values.project_id), "page");

  return response;
};
