import { redirect } from "next/navigation";

import { Box, Flex, Typography, Breadcrumbs } from "@repo/ui";
import { getServerTranslations } from "@repo/i18n";
import constants from "@repo/constants";
import { NextLayoutProps } from "@repo/types";
import { queryProject, queryProjectUsersCount } from "@utils/queries";
import { Project } from "@repo/database";

import { UpdateProjectModal } from "@components/UpdateProjectModal";

import { ProjectPageTabs } from "./ProjectPageTabs";

export const ProjectPageLayout = async ({
  children,
  params: { projectId },
}: NextLayoutProps<{ projectId: Project["id"] }>) => {
  const { t } = await getServerTranslations("common");

  const [project, usersCount] = await Promise.all([
    queryProject({ projectId }),
    queryProjectUsersCount(projectId),
  ]);

  if (!project) {
    redirect(constants.nav.routes.projects);
  }

  return (
    <Box px="6" pb="6" height="100%">
      <Flex direction="column" gap="6">
        <Flex justify="between">
          <Flex direction="column">
            <Typography size="6" weight="bold">
              {t("project")}
            </Typography>
            <Breadcrumbs
              links={[
                { href: constants.nav.routes.home, title: t("home") },
                { href: constants.nav.routes.projects, title: t("projects") },
              ]}
            />
          </Flex>
          <UpdateProjectModal project={project} />
        </Flex>
        <Flex gap="6" direction="column">
          <ProjectPageTabs
            usersCount={usersCount.count}
            informationTabTitle={t("information")}
            usersTabTitle={t("users")}
          />
          {children}
        </Flex>
      </Flex>
    </Box>
  );
};
