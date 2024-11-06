import { redirect, RedirectType } from "next/navigation";

import { NextPageProps } from "@repo/types";
import constants from "@repo/constants";
import { Project, ProjectRole } from "@repo/database";

export const ProjectRolePage = ({
  params: { projectRoleId, projectId },
}: NextPageProps<
  {},
  { projectRoleId: ProjectRole["id"]; projectId: Project["id"] }
>) => {
  redirect(
    constants.nav.routes.projectRoleInfo(projectRoleId, projectId),
    RedirectType.replace,
  );
};
