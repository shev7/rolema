import { cookies } from "next/headers";

import { BaseAPI } from "@repo/utils/api";
import constants from "@repo/constants";

export const webAPI = new BaseAPI({
  baseURL: constants.config.WEB_API_URL,
  cookies: () => cookies().toString(),
});
