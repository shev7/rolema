import { webAPI } from "@api/web";
import { ProjectRole } from "@repo/database";

export const queryProjectRole = (projectRoleId: ProjectRole["id"]) => {
  return webAPI.get<ProjectRole>(`/projects/roles/${projectRoleId}`);
};
