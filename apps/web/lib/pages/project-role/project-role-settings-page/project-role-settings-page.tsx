import { ProjectRole } from "@repo/database";
import { NextPageProps } from "@repo/types";

import { Flex } from "@repo/ui";
import { queryProjectRole } from "@queries/query-project-role";
import { ProjectRoleNameForm } from "./project-role-name-form";
import { ProjectRoleDeleteForm } from "./project-role-delete-form";

export const ProjectRoleSettingsPage = async ({
  params: { projectRoleId, projectId },
}: NextPageProps<
  {},
  { projectRoleId: ProjectRole["id"]; projectId: ProjectRole["project_id"] }
>) => {
  const [projectRole] = await Promise.all([queryProjectRole(projectRoleId)]);

  return (
    <Flex gap="6" direction="column">
      <ProjectRoleNameForm projectRole={projectRole} />
      <ProjectRoleDeleteForm projectId={projectId} projectRole={projectRole} />
    </Flex>
  );
};
