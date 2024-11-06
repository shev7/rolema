import { BaseAPI } from "@repo/utils/api";
import constants from "@repo/constants";
import { cookies } from "next/headers";

export const adminAPI = new BaseAPI({
  baseURL: constants.config.ADMIN_API_URL,
  cookies: () => cookies().toString(),
});
