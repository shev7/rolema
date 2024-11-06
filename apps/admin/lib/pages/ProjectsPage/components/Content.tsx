import Link from "next/link";

import { Box, Flex, Typography, Breadcrumbs, Button } from "@repo/ui";
import { getServerTranslations } from "@repo/i18n";
import constants from "@repo/constants";
import { ProjectsServiceBase } from "@repo/nest";

import { ProjectsTable } from "@components/ProjectsTable";

type ContentProps = {
  projects: Awaited<ReturnType<ProjectsServiceBase["getProjects"]>>;
};

export const Content = async ({ projects }: ContentProps) => {
  const { t } = await getServerTranslations("common");

  return (
    <Box px="6" pb="6" height="100%">
      <Flex direction="column" gap="6">
        <Flex justify="between">
          <Flex direction="column">
            <Typography size="6" weight="bold">
              {t("projects")}
            </Typography>
            <Breadcrumbs
              links={[{ href: constants.nav.routes.home, title: t("home") }]}
            />
          </Flex>
          <Button asChild>
            <Link href={constants.nav.routes.createProject} prefetch={false}>
              {t("create")}
            </Link>
          </Button>
        </Flex>
        <ProjectsTable projects={projects} />
      </Flex>
    </Box>
  );
};
