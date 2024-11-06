import { RedirectType, redirect } from "next/navigation";

import { NextPageProps } from "@repo/types";
import constants from "@repo/constants";

export const ProjectPage = async ({
  params: { projectId },
}: NextPageProps<{}, { projectId: string }>) => {
  redirect(constants.nav.routes.projectInfo(projectId), RedirectType.replace);
};
