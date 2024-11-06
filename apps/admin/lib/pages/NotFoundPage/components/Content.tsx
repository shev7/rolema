import Link from "next/link";

import { Box, Flex, Typography, Button } from "@repo/ui";
import { getServerTranslations } from "@repo/i18n";
import constants from "@repo/constants";

export const Content = async () => {
  const { t } = await getServerTranslations("common");

  return (
    <Box px="6" pb="6" pt="9" height="100%">
      <Flex gap="4" direction="column" align="center">
        <Typography size="9" weight="regular" align="center">
          {t("page is not found")}
        </Typography>
        <Button variant="ghost" asChild>
          <Link href={constants.nav.routes.home} prefetch={false}>
            <Typography size="4">{t("home")}</Typography>
          </Link>
        </Button>
      </Flex>
    </Box>
  );
};
