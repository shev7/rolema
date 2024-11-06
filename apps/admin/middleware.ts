import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

import { getSession } from "@repo/utils/session";
import constants from "@repo/constants";

import { queryUser } from "@utils/queries";

const middleware = async (request: NextRequest) => {
  const session = await getSession(cookies());

  if (!session.user_id) {
    return NextResponse.redirect(
      new URL(
        `${constants.nav.routes.login}?${new URLSearchParams({ [constants.nav.sp.keys.url]: request.nextUrl.pathname })}`,
        request.url,
      ),
    );
  }

  try {
    const user = await queryUser(session.user_id);

    if (user?.role !== "admin" || !user.email_verified) {
      return NextResponse.redirect(
        new URL(constants.nav.routes.accessDenied, request.url),
      );
    }
  } catch (error) {
    return NextResponse.redirect(
      new URL(constants.nav.routes.accessDenied, request.url),
    );
  }
};

export const config = {
  matcher: [
    `/((?!api|_next/static|_next/image|favicon.ico|login|register|access-denied).*)`,
  ],
};

export default middleware;
