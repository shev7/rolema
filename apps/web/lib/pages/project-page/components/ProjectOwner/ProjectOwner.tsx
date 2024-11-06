import { webAPI } from "@api/web";

import { Project, QueryProjectRolesReturnType } from "@repo/database";
import { getServerTranslations } from "@repo/i18n";

import { Page } from "@components/Page";

import { ProjectOwnerEmptyState } from "./components/ProjectOwnerEmptyState";
import { Slide } from "@components/slide";

export const ProjectOwner = async ({ project }: { project: Project }) => {
  const [projectRoles] = await Promise.all([
    webAPI.get<QueryProjectRolesReturnType>(`/projects/${project.id}/roles`, {
      cache: "no-cache",
    }),
  ]);

  const { t } = await getServerTranslations();

  return (
    <>
      <Page.Title title={t("overview")} />
      {projectRoles.length === 0 ? (
        <ProjectOwnerEmptyState project={project} />
      ) : (
        <Page.Content>
          <Slide direction="right" duration={300}>
            Project overview
          </Slide>
        </Page.Content>
      )}
    </>
  );
};
