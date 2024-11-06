import { notFound } from "next/navigation";

import { Project, ProjectRole } from "@repo/database";
import { NextLayoutProps } from "@repo/types";
import constants from "@repo/constants";
import { getServerTranslations } from "@repo/i18n";
import { Flex, ChevronLeftIcon } from "@repo/ui";

import { Page } from "@components/Page";
import { InviteUserModal } from "@components/InviteUserModal";
import { Menu } from "@components/menu";

import { queryProjectRole } from "@queries/query-project-role";
import { Slide } from "@components/slide";

export const ProjectRolePageLayout = async ({
  children,
  params: { projectRoleId, projectId },
}: NextLayoutProps<{
  projectRoleId: ProjectRole["id"];
  projectId: Project["id"];
}>) => {
  const [projectRole] = await Promise.all([queryProjectRole(projectRoleId)]);

  if (!projectRole) {
    notFound();
  }

  const { t } = await getServerTranslations();

  return (
    <>
      <Page.Title title={projectRole.name}>
        <Slide duration={300} direction="right">
          <InviteUserModal projectId={projectId} projectRoles={[projectRole]} />
        </Slide>
      </Page.Title>

      <Page.ContentWithMenu
        aside={
          <Menu
            options={[
              {
                href: constants.nav.routes.projectRoles(projectId),
                title: (
                  <Flex gap="1" align="center">
                    <ChevronLeftIcon />
                    {t("back to roles")}
                  </Flex>
                ),
              },
              {
                href: constants.nav.routes.projectRoleInfo(
                  projectRoleId,
                  projectId,
                ),
                title: t("information"),
              },
              {
                href: constants.nav.routes.projectRoleUsers(
                  projectRoleId,
                  projectId,
                ),
                title: t("users"),
              },
              {
                href: constants.nav.routes.projectRolePermissions(
                  projectRoleId,
                  projectId,
                ),
                title: t("permissions"),
              },
              {
                href: constants.nav.routes.projectRoleSettings(
                  projectRoleId,
                  projectId,
                ),
                title: t("settings"),
              },
            ]}
          />
        }
      >
        {children}
      </Page.ContentWithMenu>
    </>
  );
};
