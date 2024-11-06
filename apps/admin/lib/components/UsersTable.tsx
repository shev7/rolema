import Link from "next/link";

import { Box, Button, CheckIcon, Table, Typography } from "@repo/ui";
import { getServerTranslations } from "@repo/i18n";
import { QueryUsersReturnType } from "@repo/database";
import constants from "@repo/constants";
import { arrayToSearchParams } from "@repo/utils";

import { UserRoleBadge } from "./UserRoleBadge";
import { UserRoleFilter, UserRoleFilterProps } from "./UserRoleFilter";
import { UserStatusBadge } from "./UserStatusBadge";

type UsersTableProps = {
  users: QueryUsersReturnType;
} & UserRoleFilterProps;

export const UsersTable = async ({
  users,
  pathname,
  selectedUserRoles = [],
  usersSort,
}: UsersTableProps) => {
  const { t, i18n } = await getServerTranslations("common");

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell align="center">
            {t("email")}
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell align="center">
            <UserRoleFilter
              pathname={pathname}
              usersSort={usersSort}
              selectedUserRoles={selectedUserRoles}
            />
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell align="center">
            {t("status")}
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell align="center">
            {t("registered")}
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell align="center">
            {t("email verified")}
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell align="right">
            {t("email verified at")}
          </Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {users.length === 0 && (
          <Box py="2">
            <Typography>{t("no users found")}</Typography>
          </Box>
        )}
        {users.map(
          ({
            id,
            email,
            role,
            status,
            created_at,
            email_verified,
            email_verified_at,
          }) => {
            const searchParams = arrayToSearchParams(
              [
                ...selectedUserRoles.filter((r) => r !== role),
                ...(selectedUserRoles.includes(role) ? [] : [role]),
              ],
              constants.nav.sp.keys.userRole,
              usersSort
                ? [constants.nav.sp.keys.usersSort, usersSort]
                : undefined,
            ).toString();

            return (
              <Table.Row key={id}>
                <Table.RowHeaderCell>
                  <Button variant="ghost" asChild>
                    <Link
                      href={constants.nav.routes.userInfo(id)}
                      prefetch={false}
                    >
                      {id}
                    </Link>
                  </Button>
                </Table.RowHeaderCell>
                <Table.Cell align="center">{email}</Table.Cell>
                <Table.Cell align="center">
                  <Link
                    prefetch={false}
                    href={`${pathname}${searchParams ? `?${searchParams}` : ""}`}
                    replace
                  >
                    <UserRoleBadge role={role} />
                  </Link>
                </Table.Cell>
                <Table.Cell align="center">
                  <UserStatusBadge status={status} />
                </Table.Cell>
                <Table.Cell align="center">
                  {new Date(created_at).toLocaleString(i18n.resolvedLanguage)}
                </Table.Cell>
                <Table.Cell align="center">
                  {email_verified ? <CheckIcon /> : null}
                </Table.Cell>
                <Table.Cell align="right">
                  {email_verified_at
                    ? new Date(email_verified_at).toLocaleString(
                        i18n.resolvedLanguage,
                      )
                    : null}
                </Table.Cell>
              </Table.Row>
            );
          },
        )}
      </Table.Body>
    </Table>
  );
};
