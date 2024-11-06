import { redirect, RedirectType } from "next/navigation";

import { NextPageProps } from "@repo/types";
import { ProjectUser } from "@repo/database";
import constants from "@repo/constants";
import { getServerTranslations } from "@repo/i18n";

import { Page } from "@components/Page";
import { UsersTable } from "@components/UsersTable";
import { InviteUserModal } from "@components/InviteUserModal";

import { queryCurrentUser } from "@queries/query-current-user";
import { queryProjectUsers } from "@queries/query-project-users";
import { queryProject } from "@queries/query-project";
import { queryProjectRoles } from "@queries/query-project-roles";
import { Flex } from "@repo/ui";
import { NoRoles } from "@components/no-roles";
import { Slide } from "@components/slide";
import { queryProjectUsersPermissions } from "@queries/query-project-users-permissions";

export const UsersPage = async ({
  params: { projectId },
}: NextPageProps<{}, { projectId: ProjectUser["project_id"] }>) => {
  const currentUser = await queryCurrentUser();

  const isGeneralRole = currentUser?.role === "general";

  if (!currentUser) {
    redirect(constants.nav.routes.login, RedirectType.replace);
  }

  const [projectUsers, project, projectRoles] = await Promise.all([
    isGeneralRole
      ? queryProjectUsersPermissions(projectId, currentUser.project_role_id!)
      : queryProjectUsers(projectId),
    isGeneralRole ? null : queryProject(projectId),
    isGeneralRole ? null : queryProjectRoles({ projectId }),
  ]);

  if (!isGeneralRole && !project) {
    redirect(constants.nav.routes.dashboard);
  }

  const { t } = await getServerTranslations();

  if (isGeneralRole) {
    return (
      <Page.Content>
        <Flex>
          <UsersTable projectUsers={projectUsers} />
        </Flex>
      </Page.Content>
    );
  }

  if (project) {
    return (
      <>
        <Page.Title title={t("users")}>
          {projectRoles && projectRoles.length > 0 && (
            <Slide duration={300} direction="right">
              <InviteUserModal
                projectId={project.id}
                projectRoles={projectRoles}
                buttonProps={{ size: "2", variant: "outline" }}
              />
            </Slide>
          )}
        </Page.Title>
        <Page.Content>
          <Flex
            {...(projectUsers.length === 0 && {
              align: "center",
              justify: "center",
            })}
          >
            {projectRoles && projectRoles.length === 0 ? (
              <NoRoles projectId={projectId} />
            ) : (
              <UsersTable projectUsers={projectUsers} />
            )}
          </Flex>
        </Page.Content>
      </>
    );
  }
};
