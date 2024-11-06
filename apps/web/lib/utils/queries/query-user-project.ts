import { webAPI } from "@api/web";

import { Project } from "@repo/database";
import { UserProjectServiceBase } from "@repo/nest";

export const queryUserProject = async (
  ownerId: Project["owner_id"],
  projectId: Project["id"],
) => {
  try {
    return await webAPI.get<
      Awaited<ReturnType<UserProjectServiceBase["getUserProject"]>>
    >(`/users/${ownerId}/projects/${projectId}`, {
      cache: "no-cache",
    });
  } catch {
    return null;
  }
};
