import { NextRequest, NextResponse } from "next/server";

import constants from "@repo/constants";

import { queryProject } from "@queries/query-project";
import { queryProjectUser } from "@queries/query-project-user";
import { CurrentUser } from "@queries/query-current-user";

import { formURL } from "./form-url";

export const handleProjectsRoute = async (
  { nextUrl: { pathname }, url }: NextRequest,
  user: CurrentUser,
) => {
  const projectId = pathname.split("/")[2];

  if (
    projectId &&
    pathname !== constants.nav.routes.projectSettings(projectId)
  ) {
    if (user.role === "creator") {
      const project = await queryProject(projectId);

      if (project.status === "paused") {
        return NextResponse.redirect(
          formURL(constants.nav.routes.projectSettings(projectId), url),
        );
      }
    } else {
      const project = await queryProjectUser(projectId, user.id);

      if (project && project.project.status === "paused") {
        return NextResponse.redirect(
          formURL(constants.nav.routes.projectSettings(projectId), url),
        );
      }
    }
  }
};
