import { ProjectRole } from "@repo/database";
import { NextPageProps } from "@repo/types";

import { queryProjectRoleUsers } from "@queries/query-project-role-users";
import { UsersTable } from "@components/UsersTable";
import { Flex } from "@repo/ui";

export const ProjectRoleUsersPage = async ({
  params: { projectRoleId },
}: NextPageProps<{}, { projectRoleId: ProjectRole["id"] }>) => {
  const [projectUsers] = await Promise.all([
    queryProjectRoleUsers(projectRoleId),
  ]);

  if (projectUsers.length === 0) {
    return (
      <Flex justify="center" align="center" height="100%">
        <UsersTable projectUsers={projectUsers} />
      </Flex>
    );
  }

  return <UsersTable projectUsers={projectUsers} />;
};
