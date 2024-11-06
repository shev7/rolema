"use server";

import { UpdateProjectUserStatusSchema } from "@repo/validation";

import { webAPI } from "@api/web";
import { ProjectUser } from "@repo/database";

export const updateProjectUserStatus = ({
  user_id,
  project_id,
  status,
}: UpdateProjectUserStatusSchema &
  Pick<ProjectUser, "user_id" | "project_id">) => {
  return webAPI.patch<ProjectUser>(
    `/projects/${project_id}/users/${user_id}/status`,
    {
      status,
    },
  );
};
