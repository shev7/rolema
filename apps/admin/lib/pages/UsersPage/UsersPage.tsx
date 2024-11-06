import { adminAPI } from "@api/admin";

import { QueryTiersReturnType } from "@repo/database";
import { arrayToSearchParams, filterParams, getSearchParam } from "@repo/utils";
import { NextPageProps } from "@repo/types";
import constants from "@repo/constants";

import { Content } from "./components";
import { queryUsers } from "@utils/queries";

export const UsersPage = async ({ searchParams }: NextPageProps) => {
  const selectedUserRoles = filterParams(
    getSearchParam(searchParams, constants.nav.sp.keys.userRole),
    constants.database.user.user_role,
  );

  const usersSort = filterParams(
    getSearchParam(searchParams, constants.nav.sp.keys.usersSort),
    Object.values(constants.nav.sp.sort),
  )[0];

  const urlSearchParams = arrayToSearchParams(
    selectedUserRoles,
    constants.nav.sp.keys.userRole,
    usersSort ? [constants.nav.sp.keys.usersSort, usersSort] : undefined,
  );

  const [users, tiers] = await Promise.all([
    queryUsers(urlSearchParams),
    adminAPI.get<QueryTiersReturnType>("/tiers", {
      cache: "no-cache",
    }),
  ]);

  return (
    <Content
      usersSort={usersSort}
      users={users}
      tiers={tiers}
      selectedUserRoles={selectedUserRoles}
    />
  );
};
