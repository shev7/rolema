import acceptLanguage from "accept-language";
import { cookies, headers } from "next/headers";

import constants from "@repo/constants";

import { fallbackLanguage, languages } from "../constants";
import { Languages } from "../settings";

acceptLanguage.languages([...languages]);

export const detectLanguage = () => {
  return (acceptLanguage.get(
    cookies().get(constants.cookies.language)?.value,
  ) ??
    acceptLanguage.get(headers().get("Accept-Language")) ??
    fallbackLanguage) as Languages[number];
};
