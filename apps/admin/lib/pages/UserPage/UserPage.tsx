import { redirect, RedirectType } from "next/navigation";

import { NextPageProps } from "@repo/types";
import constants from "@repo/constants";

export const UserPage = async ({
  params: { userId },
}: NextPageProps<{}, { userId: string }>) => {
  redirect(constants.nav.routes.userInfo(userId), RedirectType.replace);
};
