import constants from "@repo/constants";

import { readCookie } from "./read";

export const readAppearance = () => {
  const appearanceCookie = readCookie(constants.cookies.appearance);
  return appearanceCookie === "dark" ? "dark" : "light";
};
