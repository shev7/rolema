import { BaseAPI } from "@repo/utils/api";
import constants from "@repo/constants";
import { cookies } from "next/headers";

export const authAPI = new BaseAPI({
  baseURL: constants.config.AUTH_API_ENDPOINT,
  cookies: () => cookies().toString(),
});
