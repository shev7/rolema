import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

import { getSession } from "@repo/utils";
import constants from "@repo/constants";

import { queryCurrentUser } from "@queries/query-current-user";

import { handleHomeRoute } from "@middleware/handle-home-router";
import { handleProjectsRoute } from "@middleware/handle-projects-router";
import { formURL } from "@middleware/form-url";

const ignorePathnames = [
  constants.nav.routes.login,
  constants.nav.routes.register,
  constants.nav.routes.accessDenied,
];

const homePathnames = [
  constants.nav.routes.home,
  constants.nav.routes.projects,
];

const middleware = async (request: NextRequest) => {
  const session = await getSession(cookies());

  const { pathname } = request.nextUrl;

  if (ignorePathnames.includes(pathname)) {
    return;
  }

  if (!session.user_id) {
    return NextResponse.redirect(
      formURL(constants.nav.routes.login, request.url, [
        request.nextUrl.pathname !== "/" && [
          constants.nav.sp.keys.url,
          request.nextUrl.pathname,
        ],
      ]),
    );
  }

  try {
    const user = await queryCurrentUser();

    if (!user?.email_verified) {
      return NextResponse.redirect(
        formURL(constants.nav.routes.accessDenied, request.url, [
          ["message", "email is not verified"],
        ]),
      );
    } else if (user.role === "admin") {
      return NextResponse.redirect(
        formURL(constants.nav.routes.accessDenied, request.url, [
          ["message", "incorrect user role"],
        ]),
      );
    }

    if (homePathnames.includes(pathname)) {
      return await handleHomeRoute(session.user_id, request);
    } else if (pathname.startsWith(constants.nav.routes.projects)) {
      return await handleProjectsRoute(request, user);
    }
  } catch (error) {
    const url = formURL(constants.nav.routes.accessDenied, request.url, [
      !!(error as Error)?.message && ["message", (error as Error).message],
      !!error && typeof error === "string" && ["message", error],
    ]);

    return NextResponse.redirect(url);
  }
};

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|login|register|access-denied).*)",
  ],
};

export default middleware;
