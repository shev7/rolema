import { notFound } from "next/navigation";

import { NextPageProps } from "@repo/types";
import { ProjectUser } from "@repo/database";

import { ProjectUserCard } from "@components/ProjectUserCard";

import { queryProjectUser } from "@queries/query-project-user";

export const UserPage = async ({
  params: { userId, projectId },
}: NextPageProps<
  {},
  { userId: ProjectUser["user_id"]; projectId: ProjectUser["project_id"] }
>) => {
  const [projectUser] = await Promise.all([
    queryProjectUser(projectId, userId),
  ]);

  if (!projectUser) {
    notFound();
  }

  return <ProjectUserCard projectUser={projectUser} />;
};
