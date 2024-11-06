import { NextPageProps } from "@repo/types";
import { queryProjectRoles } from "@queries/query-project-roles";
import { getServerTranslations } from "@repo/i18n";
import { Project } from "@repo/database";

import { CreateProjectRoleModal } from "@components/create-project-role-modal";
import { Page } from "@components/Page";
import { ProjectRolesTable } from "@components/ProjectRolesTable";
import { NoRoles } from "@components/no-roles";
import { Slide } from "@components/slide";

export const ProjectRolesPage = async ({
  params: { projectId },
}: NextPageProps<{}, { projectId: Project["id"] }>) => {
  const { t } = await getServerTranslations();

  const [projectRoles] = await Promise.all([queryProjectRoles({ projectId })]);

  return (
    <>
      <Page.Title title={t("roles")}>
        <Slide duration={300} direction="right">
          <CreateProjectRoleModal
            projectId={projectId}
            buttonProps={{ size: "2", variant: "outline" }}
          />
        </Slide>
      </Page.Title>
      <Page.Content>
        <Slide duration={300} direction="right">
          {projectRoles.length === 0 ? (
            <NoRoles projectId={projectId} />
          ) : (
            <ProjectRolesTable
              projectId={projectId}
              projectRoles={projectRoles}
            />
          )}
        </Slide>
      </Page.Content>
    </>
  );
};
