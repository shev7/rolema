import { Box, Flex, Typography, Breadcrumbs } from "@repo/ui";
import { getServerTranslations } from "@repo/i18n";
import { User } from "@repo/database";
import constants from "@repo/constants";
import { NextLayoutProps } from "@repo/types";
import { queryProjectsUserCount, queryUserProjectsCount } from "@utils/queries";

import { Tabs } from "./Tabs";

export const UserPageLayout = async ({
  children,
  params: { userId },
}: NextLayoutProps<{ userId: User["id"] }>) => {
  const { t } = await getServerTranslations("common");

  const [projectsCount, projectUsersCount] = await Promise.all([
    queryUserProjectsCount(userId),
    queryProjectsUserCount(userId),
  ]);

  return (
    <Box px="6" pb="6" height="100%">
      <Flex direction="column" gap="6">
        <Flex justify="between">
          <Flex direction="column">
            <Typography size="6" weight="bold">
              {t("user")}
            </Typography>
            <Breadcrumbs
              links={[
                { href: constants.nav.routes.home, title: t("home") },
                { href: constants.nav.routes.users(), title: t("users") },
              ]}
            />
          </Flex>
        </Flex>
        <Flex gap="6" direction="column">
          <Tabs
            projectsCount={projectsCount.count}
            projectUsersCount={projectUsersCount.count}
            informationTabTitle={t("information")}
            projectsTabTitle={t("projects")}
            projectUserTabTitle={t("project user")}
          />
          {children}
        </Flex>
      </Flex>
    </Box>
  );
};
