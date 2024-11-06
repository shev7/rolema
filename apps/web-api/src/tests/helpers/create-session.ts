import { createCookieStore, getSession } from "@repo/utils";
import constants from "@repo/constants";

export const testCreateSession = async (userId: string) => {
  let sessionCookie: string = "";

  const session = await getSession(
    createCookieStore(constants.cookies.session, "", (_name, value) => {
      sessionCookie = value;
    }),
  );

  session.user_id = userId;

  await session.save();

  return sessionCookie;
};
