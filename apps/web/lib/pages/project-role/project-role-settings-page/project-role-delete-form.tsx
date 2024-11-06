import { ProjectRole } from "@repo/database";

import { Card, Flex, Typography } from "@repo/ui";
import { getServerTranslations } from "@repo/i18n";
import { Inset } from "@radix-ui/themes";

import { queryProjectRoles } from "@queries/query-project-roles";
import { queryProjectRoleUsersCount } from "@queries/query-project-role-users-count";

import { Slide } from "@components/slide";

import { DeleteProjectRoleModal } from "./delete-project-role-modal";

export const ProjectRoleDeleteForm = async ({
  projectId,
  projectRole,
}: {
  projectId: ProjectRole["project_id"];
  projectRole: ProjectRole;
}) => {
  const [projectRoles, { count: projectRoleUsersCount }] = await Promise.all([
    queryProjectRoles({ projectId, excludeProjectRoleIds: [projectRole.id] }),
    queryProjectRoleUsersCount(projectRole.id),
  ]);
  const { t } = await getServerTranslations();

  if (projectRoles.length < 1) {
    return null;
  }

  return (
    <Slide duration={300} direction="right" delay={150}>
      <Card style={{ width: "100%" }}>
        <Flex direction="column">
          <Flex pb="4">
            <Typography weight="medium" color="red" size="2">
              {`${t("delete")}`}&nbsp;"
              <Typography weight="bold">{projectRole.name}</Typography>"
            </Typography>
          </Flex>
          <Inset side="bottom">
            <Flex
              justify="end"
              px="5"
              py="4"
              data-is-root-theme="true"
              style={{
                boxShadow: "inset 0 1px 0 0 var(--gray-a5)",
              }}
            >
              <DeleteProjectRoleModal
                projectId={projectId}
                roles={projectRoles}
                usersCount={projectRoleUsersCount}
              />
            </Flex>
          </Inset>
        </Flex>
      </Card>
    </Slide>
  );
};
