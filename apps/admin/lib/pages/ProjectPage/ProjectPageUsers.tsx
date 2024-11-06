import { NextPageProps } from "@repo/types";
import constants from "@repo/constants";
import { arrayToSearchParams, filterParams, getSearchParam } from "@repo/utils";

import { UsersTable } from "@components/UsersTable";
import { queryProjectUsers } from "@utils/queries";

export const ProjectPageUsers = async ({
  params: { projectId },
  searchParams,
}: NextPageProps<{}, { projectId: string }>) => {
  const selectedUserRoles = filterParams(
    getSearchParam(searchParams, constants.nav.sp.keys.userRole),
    constants.database.user.user_role,
  );
  const sort = filterParams(
    getSearchParam(searchParams, constants.nav.sp.keys.usersSort),
    Object.values(constants.nav.sp.sort),
  )[0];

  const urlSearchParams = arrayToSearchParams(
    selectedUserRoles,
    constants.nav.sp.keys.userRole,
    sort ? [constants.nav.sp.keys.usersSort, sort] : undefined,
  );

  const [projectUsers] = await Promise.all([
    queryProjectUsers(projectId, urlSearchParams),
  ]);

  return (
    <UsersTable
      pathname={constants.nav.routes.projectUsers(projectId)}
      usersSort={sort}
      users={projectUsers.map(({ user, user_info }) => ({
        ...user,
        ...user_info,
      }))}
      selectedUserRoles={selectedUserRoles}
    />
  );
};
