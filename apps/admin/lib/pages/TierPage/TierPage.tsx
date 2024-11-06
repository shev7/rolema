import { RedirectType, redirect } from "next/navigation";

import { NextPageProps } from "@repo/types";
import constants from "@repo/constants";

export const TierPage = async ({
  params: { tierId },
}: NextPageProps<{}, { tierId: string }>) => {
  redirect(constants.nav.routes.tierInfo(tierId), RedirectType.replace);
};
