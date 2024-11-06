"use server";

import { UpdateProjectUserSchema } from "@repo/validation";

import { webAPI } from "@api/web";
import { Project, ProjectUser, User } from "@repo/database";

export const updateProjectUser = ({
  project_role_id,
  userId,
  projectId,
}: UpdateProjectUserSchema & {
  userId: User["id"];
  projectId: Project["id"];
}) => {
  return webAPI.patch<ProjectUser>(`/projects/${projectId}/users/${userId}`, {
    project_role_id,
  });
};
