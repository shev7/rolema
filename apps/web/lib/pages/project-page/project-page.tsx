import { redirect, RedirectType } from "next/navigation";

import { NextPageProps } from "@repo/types";
import constants from "@repo/constants";
import { Typography } from "@repo/ui";
import { getServerTranslations } from "@repo/i18n";

import { queryProjectUser } from "@queries/query-project-user";
import { queryUserProject } from "@queries/query-user-project";
import { queryCurrentUser } from "@queries/query-current-user";
import { ProjectOwner } from "./components/ProjectOwner/ProjectOwner";
import { ProjectUser } from "./components/ProjectUser/ProjectUser";

export const ProjectPage = async ({
  params: { projectId },
}: NextPageProps<{}, { projectId: string }>) => {
  const currentUser = await queryCurrentUser();

  if (!currentUser) {
    redirect(constants.nav.routes.login, RedirectType.replace);
  }

  const [projectUser, project] = await Promise.all([
    queryProjectUser(projectId, currentUser.id),
    queryUserProject(currentUser.id, projectId),
  ]);

  const { t } = await getServerTranslations();

  if (
    (!project && currentUser.role === "creator") ||
    (!projectUser && currentUser.role === "general")
  ) {
    return <Typography>{t("project is not found")}</Typography>;
  }

  if (currentUser.role === "creator") {
    return <ProjectOwner project={project!} />;
  }

  return <ProjectUser projectUser={projectUser!} />;
};
