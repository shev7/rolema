"use server";

import { Project } from "@repo/database";
import { webAPI } from "@api/web";

export const updateProject = ({
  id,
  name,
  description,
}: Pick<Project, "id" | "name" | "description">) => {
  return webAPI.patch<Project>(`/projects/${id}`, {
    project: { name, description },
  });
};
