import { Box, Flex, Typography, Breadcrumbs } from "@repo/ui";
import { getServerTranslations } from "@repo/i18n";
import constants from "@repo/constants";

import {
  CreateProjectForm,
  type CreateProjectFormProps,
} from "@components/CreateProjectForm";

export type ContentProps = CreateProjectFormProps;

export const Content = async (props: ContentProps) => {
  const { t } = await getServerTranslations("common");

  return (
    <Box px="6" pb="6" height="100%">
      <Flex direction="column" gap="6">
        <Flex justify="between">
          <Flex direction="column">
            <Typography size="6" weight="bold">
              {t("create a project")}
            </Typography>
            <Breadcrumbs
              links={[
                { href: constants.nav.routes.home, title: t("home") },
                { href: constants.nav.routes.projects, title: t("projects") },
              ]}
            />
          </Flex>
        </Flex>
        <CreateProjectForm {...props} />
      </Flex>
    </Box>
  );
};
