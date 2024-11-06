"use server";

import { webAPI } from "@api/web";
import { ProjectUser } from "@repo/database";
import { revalidatePath } from "next/cache";

type DeleteProjectUserVariables = {
  projectId: ProjectUser["project_id"];
  userId: ProjectUser["user_id"];
};

export const deleteProjectUser = async ({
  projectId,
  userId,
}: DeleteProjectUserVariables) => {
  const response = await webAPI.delete(
    `/projects/${projectId}/users/${userId}`,
  );

  revalidatePath("/");

  return response;
};
