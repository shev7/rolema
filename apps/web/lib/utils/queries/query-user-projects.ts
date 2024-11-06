import { webAPI } from "@api/web";
import { User } from "@repo/database";
import { UserProjectsServiceBase } from "@repo/nest";

export const queryUserProjects = (userId: User["id"]) => {
  return webAPI.get<
    Awaited<ReturnType<UserProjectsServiceBase["getProjects"]>>
  >(`/users/${userId}/projects`, {
    cache: "no-cache",
  });
};
