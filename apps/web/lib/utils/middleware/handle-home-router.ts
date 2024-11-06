import { NextRequest, NextResponse } from "next/server";

import constants from "@repo/constants";

import { queryUserProjects } from "@queries/query-user-projects";
import { queryProjectsUser } from "@queries/query-projects-user";

import { readCookie } from "@cookies/read";

import { formURL } from "./form-url";

export const handleHomeRoute = async (userId: string, request: NextRequest) => {
  const userProjects = await queryUserProjects(userId);

  if (userProjects.length === 1) {
    return NextResponse.redirect(
      formURL(constants.nav.routes.project(userProjects[0]!.id), request.url),
    );
  } else if (userProjects.length > 1) {
    const projectId =
      readCookie(constants.cookies.project) ?? userProjects[0]!.id;

    const project =
      userProjects.find((project) => project.id === projectId) ??
      userProjects[0];

    const url =
      project!.status === "ready"
        ? constants.nav.routes.project(project!.id)
        : constants.nav.routes.projectSettings(project!.id);

    return NextResponse.redirect(formURL(url, request.url));
  }

  const projectsUser = await queryProjectsUser(userId);

  if (projectsUser.length === 1) {
    return NextResponse.redirect(
      formURL(
        constants.nav.routes.project(projectsUser[0]!.project.id),
        request.url,
      ),
    );
  } else if (projectsUser.length > 1) {
    const projectId =
      readCookie(constants.cookies.project) ?? projectsUser[0]!.project.id;

    const projectUser =
      projectsUser.find(
        (projectUser) => projectUser.project.id === projectId,
      ) ?? projectsUser[0];

    return NextResponse.redirect(
      formURL(
        constants.nav.routes.project(projectUser!.project.id),
        request.url,
      ),
    );
  }

  return NextResponse.redirect(
    formURL(constants.nav.routes.accessDenied, request.url, [
      ["message", "no projects found"],
    ]),
  );
};
