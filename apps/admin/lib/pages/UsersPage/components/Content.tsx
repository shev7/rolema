import { Box, Flex, Typography, Breadcrumbs } from "@repo/ui";
import {
  QueryTiersReturnType,
  QueryUsersReturnType,
  User,
} from "@repo/database";
import { getServerTranslations } from "@repo/i18n";
import constants from "@repo/constants";
import { Sort } from "@repo/types";

import { UsersTable } from "@components/UsersTable";
import { InviteUserModal } from "@components/InviteUserModal";

export type ContentProps = {
  users: QueryUsersReturnType;
  selectedUserRoles: Array<User["role"]>;
  usersSort?: Sort;
  tiers: QueryTiersReturnType;
};

export const Content = async ({
  users,
  usersSort,
  selectedUserRoles,
  tiers,
}: ContentProps) => {
  const { t } = await getServerTranslations();

  return (
    <Box px="6" pb="6" height="100%">
      <Flex direction="column" gap="6">
        <Flex justify="between">
          <Flex direction="column">
            <Typography size="6" weight="bold">
              {t("users")}
            </Typography>
            <Breadcrumbs
              links={[{ href: constants.nav.routes.home, title: t("home") }]}
            />
          </Flex>
          <InviteUserModal tiers={tiers} />
        </Flex>
        <UsersTable
          usersSort={usersSort}
          pathname={constants.nav.routes.users()}
          users={users}
          selectedUserRoles={selectedUserRoles}
        />
      </Flex>
    </Box>
  );
};
