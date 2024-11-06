import { Box, Flex, Typography, Breadcrumbs } from "@repo/ui";
import { QueryTiersReturnType } from "@repo/database";
import { getServerTranslations } from "@repo/i18n";
import constants from "@repo/constants";

import { TiersTable } from "@components/TiersTable";

export type ContentProps = {
  tiers: QueryTiersReturnType;
};

export const Content = async ({ tiers }: ContentProps) => {
  const { t } = await getServerTranslations("common");

  return (
    <Box px="6" pb="6" height="100%">
      <Flex direction="column" gap="6">
        <Flex justify="between">
          <Flex direction="column">
            <Typography size="6" weight="bold">
              {t("tiers")}
            </Typography>
            <Breadcrumbs
              links={[{ href: constants.nav.routes.home, title: t("home") }]}
            />
          </Flex>
        </Flex>
        <TiersTable tiers={tiers} />
      </Flex>
    </Box>
  );
};
