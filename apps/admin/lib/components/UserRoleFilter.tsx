import Link from "next/link";

import {
  Button,
  CheckIcon,
  DropdownMenu,
  Flex,
  HamburgerMenuIcon,
} from "@repo/ui";
import constants from "@repo/constants";
import { arrayToSearchParams } from "@repo/utils";
import { getServerTranslations } from "@repo/i18n";
import { Sort } from "@repo/types";
import { User } from "@repo/database";

export type UserRoleFilterProps = {
  pathname: string;
  selectedUserRoles?: Array<User["role"]>;
  usersSort?: Sort;
};

export const UserRoleFilter = async ({
  selectedUserRoles = [],
  pathname,
  usersSort,
}: UserRoleFilterProps) => {
  const { t } = await getServerTranslations("common");

  const userRoleAscLinkSearchParams = arrayToSearchParams(
    selectedUserRoles,
    constants.nav.sp.keys.userRole,
    usersSort === constants.nav.sp.sort.userRoleAsc
      ? undefined
      : [constants.nav.sp.keys.usersSort, constants.nav.sp.sort.userRoleAsc],
  );

  const userRoleDescLinkSearchParams = arrayToSearchParams(
    selectedUserRoles,
    constants.nav.sp.keys.userRole,
    usersSort === constants.nav.sp.sort.userRoleDesc
      ? undefined
      : [constants.nav.sp.keys.usersSort, constants.nav.sp.sort.userRoleDesc],
  );

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger>
        <Button variant="ghost">
          <HamburgerMenuIcon />
          {`${t("role")} ${
            selectedUserRoles.length ? `(${selectedUserRoles.length})` : ""
          }`}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {constants.database.user.user_role.map((role) => {
          const roleHref = arrayToSearchParams(
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
            <DropdownMenu.Item key={role} asChild>
              <Link href={`${pathname}${roleHref ? `?${roleHref}` : ""}`}>
                <Flex align="center" gap="4" justify="between" width="100%">
                  {t(role)}
                  <CheckIcon
                    opacity={selectedUserRoles.includes(role) ? 1 : 0}
                  />
                </Flex>
              </Link>
            </DropdownMenu.Item>
          );
        })}
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>{t("sort")}</DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.Item asChild>
              <Link
                href={`${pathname}${userRoleAscLinkSearchParams.toString() ? `?${userRoleAscLinkSearchParams}` : ""}`}
              >
                <Flex align="center" justify="between" gap="4" width="100%">
                  {t("ascending")}
                  <CheckIcon
                    opacity={
                      usersSort === constants.nav.sp.sort.userRoleAsc ? 1 : 0
                    }
                  />
                </Flex>
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <Link
                href={`${pathname}${userRoleDescLinkSearchParams.toString() ? `?${userRoleDescLinkSearchParams}` : ""}`}
              >
                <Flex align="center" justify="between" gap="4" width="100%">
                  {t("descending")}
                  <CheckIcon
                    opacity={
                      usersSort === constants.nav.sp.sort.userRoleDesc ? 1 : 0
                    }
                  />
                </Flex>
              </Link>
            </DropdownMenu.Item>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
        {(selectedUserRoles.length > 0 || !!usersSort) && (
          <>
            <DropdownMenu.Separator />
            <DropdownMenu.Item asChild>
              <Link href={pathname}>{t("clear all")}</Link>
            </DropdownMenu.Item>
          </>
        )}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};
