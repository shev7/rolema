import { NextPageProps } from "@repo/types";
import { ProjectUser } from "@repo/database";
import { Flex } from "@repo/ui";

import { queryProject } from "@queries/query-project";
import { queryProjectStatistics } from "@queries/query-project-statistics";

import { InfoCard } from "./info-card";
import { FieldsCard } from "./fields-card";
import { Slide } from "@components/slide";

export const ProjectSettingsGeneralPage = async ({
  params: { projectId },
}: NextPageProps<{}, { projectId: ProjectUser["project_id"] }>) => {
  const [project, projectStatistics] = await Promise.all([
    queryProject(projectId),
    queryProjectStatistics(projectId),
  ]);

  return (
    <Flex gap="6" direction="column">
      <Slide direction="right" duration={300}>
        <InfoCard project={project} projectStatistics={projectStatistics} />
      </Slide>
      <Slide direction="right" duration={300} delay={150}>
        <FieldsCard project={project} />
      </Slide>
    </Flex>
  );
};
