import { ProjectUserServiceBase } from "@repo/nest";

import { Page } from "@components/Page";
import { getServerTranslations } from "@repo/i18n";

type ProjectUserProps = {
  projectUser: NonNullable<
    Awaited<ReturnType<ProjectUserServiceBase["getProjectsUser"]>>
  >;
};

export const ProjectUser = async ({ projectUser: _ }: ProjectUserProps) => {
  const { t } = await getServerTranslations();

  return (
    <>
      <Page.Title title={t("overview")} />
    </>
  );
};
