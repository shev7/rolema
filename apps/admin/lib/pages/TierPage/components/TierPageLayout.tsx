import { Box, Flex, Typography, Breadcrumbs } from "@repo/ui";
import { getServerTranslations } from "@repo/i18n";
import constants from "@repo/constants";
import { NextLayoutProps } from "@repo/types";
import { Tier } from "@repo/database";

import { TierPageTabs } from "./TierPageTabs";
import { EditTierModal } from "@components/edit-tier-modal";
import { queryTier } from "@queries/query-tier";

export const TierPageLayout = async ({
  children,
  params: { tierId },
}: NextLayoutProps<{ tierId: Tier["id"] }>) => {
  const { t } = await getServerTranslations("common");

  const [tier] = await Promise.all([queryTier(tierId)]);

  return (
    <Box px="6" pb="6" height="100%">
      <Flex direction="column" gap="6">
        <Flex justify="between">
          <Flex direction="column">
            <Typography size="6" weight="bold">
              {t("tier")}
            </Typography>
            <Breadcrumbs
              links={[
                { href: constants.nav.routes.home, title: t("home") },
                { href: constants.nav.routes.tiers(), title: t("tiers") },
              ]}
            />
          </Flex>
          <EditTierModal tier={tier} />
        </Flex>
        <Flex gap="6" direction="column">
          <TierPageTabs informationTabTitle={t("information")} />
          {children}
        </Flex>
      </Flex>
    </Box>
  );
};
