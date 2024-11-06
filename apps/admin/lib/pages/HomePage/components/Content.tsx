import Link from "next/link";

import { Box, Flex, Card, Typography } from "@repo/ui";
import { getServerTranslations } from "@repo/i18n";
import constants from "@repo/constants";
import { QueryProjectsPerTierStatisticReturnType } from "@repo/database";
import { ProjectsServiceBase, UsersServiceBase } from "@repo/nest";

type ContentProps = {
  usersStatistic: Awaited<ReturnType<UsersServiceBase["getUsersStatistic"]>>;
  projectsStatistics: Awaited<ReturnType<ProjectsServiceBase["getStatistics"]>>;
  projectsPerTierStatistic: QueryProjectsPerTierStatisticReturnType;
};

export const Content = async ({
  usersStatistic,
  projectsStatistics: projectsStatistic,
  projectsPerTierStatistic,
}: ContentProps) => {
  const { t } = await getServerTranslations("common");

  return (
    <Box px="6" pb="6">
      <Flex direction="column" gap="6">
        <Flex wrap="wrap" gap="6">
          <Link href={constants.nav.routes.users()} prefetch={false}>
            <Card style={{ width: "20rem", height: "100%" }}>
              <Box p="2" height="100%">
                <Flex direction="column" gap="4" height="100%">
                  <Flex justify="between" gap="4">
                    <Typography size="6"> {t("users")}</Typography>
                    <Typography size="6">
                      {usersStatistic?.total ?? 0}
                    </Typography>
                  </Flex>
                  <Flex direction="column" gap="0" justify="end">
                    <Flex justify="between" gap="4">
                      <Typography size="2" color="gray">
                        {t("admin users")}
                      </Typography>
                      <Typography size="2" color="gray">
                        {usersStatistic?.admin ?? 0}
                      </Typography>
                    </Flex>
                    <Flex justify="between" gap="4">
                      <Typography size="2" color="gray">
                        {t("creator users")}
                      </Typography>
                      <Typography size="2" color="gray">
                        {usersStatistic?.creator ?? 0}
                      </Typography>
                    </Flex>
                    <Flex justify="between" gap="4">
                      <Typography size="2" color="gray">
                        {t("general users")}
                      </Typography>
                      <Typography size="2" color="gray">
                        {usersStatistic?.general ?? 0}
                      </Typography>
                    </Flex>
                  </Flex>
                </Flex>
              </Box>
            </Card>
          </Link>
          <Link href={constants.nav.routes.projects} prefetch={false}>
            <Card style={{ width: "20rem", height: "100%" }}>
              <Box p="2" height="100%">
                <Flex direction="column" gap="4" height="100%">
                  <Flex justify="between" gap="4">
                    <Typography size="6">{t("projects")}</Typography>
                    <Typography size="6">{projectsStatistic?.total}</Typography>
                  </Flex>
                  <Flex direction="column" gap="0" justify="end">
                    {projectsStatistic.project_statistics.map(
                      ({ count, status }) => (
                        <Flex key={status} justify="between" gap="4">
                          <Typography size="2" color="gray">
                            {t(status)}
                          </Typography>
                          <Typography size="2" color="gray">
                            {count}
                          </Typography>
                        </Flex>
                      ),
                    )}
                  </Flex>
                </Flex>
              </Box>
            </Card>
          </Link>
          <Link href={constants.nav.routes.tiers()} prefetch={false}>
            <Card style={{ width: "20rem", height: "100%" }}>
              <Box p="2" height="100%">
                <Flex direction="column" gap="4" height="100%">
                  <Flex justify="between" gap="4">
                    <Typography size="6"> {t("tiers")}</Typography>
                    <Typography size="6">
                      {projectsPerTierStatistic.length}
                    </Typography>
                  </Flex>
                  <Flex direction="column" gap="0" justify="end">
                    {projectsPerTierStatistic.map(
                      ({ tier: { id, name }, projects_count }) => (
                        <Flex key={id} justify="between" gap="4">
                          <Typography size="2" color="gray">
                            {name}
                          </Typography>
                          <Typography size="2" color="gray">
                            {projects_count}
                          </Typography>
                        </Flex>
                      ),
                    )}
                  </Flex>
                </Flex>
              </Box>
            </Card>
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
};
