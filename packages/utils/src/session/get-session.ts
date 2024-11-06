import { IronSession, getIronSession } from "iron-session";

import { CookieStore } from "@repo/types";
import constants from "@repo/constants";

export type UserSession = IronSession<{ user_id: string }>;

export const getSession = (cookieStore: CookieStore): Promise<UserSession> => {
  // @ts-expect-error bit different interface with IronSession
  return getIronSession(cookieStore, {
    password: constants.config.AUTH_PASSWORD,
    cookieName: constants.cookies.session,
    ttl: constants.cookies.lifetimes.session,
  });
};
