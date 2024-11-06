import { redirect, RedirectType } from "next/navigation";

import { NextPageProps } from "@repo/types";
import constants from "@repo/constants";

import { queryUserProjects } from "@utils/queries";
import { ProjectsTable } from "@components/ProjectsTable";

export const UserPageProjects = async ({
  params: { userId },
}: NextPageProps<{}, { userId: string }>) => {
  const [projects] = await Promise.all([queryUserProjects(userId)]);

  if (projects.length === 0) {
    redirect(constants.nav.routes.userInfo(userId), RedirectType.replace);
  }

  return <ProjectsTable projects={projects} />;
};
