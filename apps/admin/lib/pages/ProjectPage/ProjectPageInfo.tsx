import Link from "next/link";
import { redirect } from "next/navigation";

import { DataList, Button, Card, Flex } from "@repo/ui";
import { getServerTranslations } from "@repo/i18n";
import constants from "@repo/constants";
import { NextPageProps } from "@repo/types";

import { ProjectStatus } from "@components/ProjectStatus";
import { UpdateProjectStatusModal } from "@components/UpdateProjectStatusModal";

import { queryProject, queryProjectTier } from "@utils/queries";

export const ProjectPageInfo = async ({
  params: { projectId },
}: NextPageProps<{}, { projectId: string }>) => {
  const { t, i18n } = await getServerTranslations("common");

  const [project, projectTier] = await Promise.all([
    queryProject({ projectId }),
    queryProjectTier(projectId),
  ]);

  if (!project || !projectTier) {
    redirect(constants.nav.routes.projects);
  }

  return (
    <Flex gap="6">
      <Card style={{ width: "fit-content", height: "fit-content" }}>
        <DataList>
          <DataList.Item align="center">
            <DataList.Label>ID</DataList.Label>
            <DataList.Value>{project.id}</DataList.Value>
          </DataList.Item>

          <DataList.Item align="center">
            <DataList.Label>{t("name")}</DataList.Label>
            <DataList.Value>{project.name}</DataList.Value>
          </DataList.Item>

          <DataList.Item align="center">
            <DataList.Label>{t("description")}</DataList.Label>
            <DataList.Value>{project.description}</DataList.Value>
          </DataList.Item>

          <DataList.Item align="center">
            <DataList.Label>{t("status")}</DataList.Label>
            <DataList.Value>
              <Flex align="center" gap="2">
                <ProjectStatus status={project.status} />
                <UpdateProjectStatusModal
                  id={project.id}
                  status={project.status}
                />
              </Flex>
            </DataList.Value>
          </DataList.Item>

          <DataList.Item>
            <DataList.Label>{t("owner")}</DataList.Label>
            <DataList.Value>
              <Button variant="ghost" asChild>
                <Link
                  href={constants.nav.routes.userInfo(project.owner_id)}
                  prefetch={false}
                >
                  {project.owner_id}
                </Link>
              </Button>
            </DataList.Value>
          </DataList.Item>

          <DataList.Item>
            <DataList.Label>{t("created by")}</DataList.Label>
            <DataList.Value>
              <Button variant="ghost" asChild>
                <Link
                  href={constants.nav.routes.userInfo(project.created_by)}
                  prefetch={false}
                >
                  {project.created_by}
                </Link>
              </Button>
            </DataList.Value>
          </DataList.Item>

          <DataList.Item>
            <DataList.Label>{t("created at")}</DataList.Label>
            <DataList.Value>
              {new Date(project.created_at).toLocaleString(
                i18n.resolvedLanguage,
              )}
            </DataList.Value>
          </DataList.Item>

          <DataList.Item>
            <DataList.Label>{t("updated at")}</DataList.Label>
            <DataList.Value>
              {new Date(project.updated_at).toLocaleString(
                i18n.resolvedLanguage,
              )}
            </DataList.Value>
          </DataList.Item>
        </DataList>
      </Card>
      <Card style={{ width: "fit-content", height: "fit-content" }}>
        <DataList>
          <DataList.Item align="center">
            <DataList.Label>{t("tier")}</DataList.Label>
            <DataList.Value>
              <Button variant="ghost" asChild>
                <Link
                  href={constants.nav.routes.tier(projectTier.tier.id)}
                  prefetch={false}
                >
                  {projectTier.tier.id}
                </Link>
              </Button>
            </DataList.Value>
          </DataList.Item>

          <DataList.Item align="center">
            <DataList.Label>{t("ends at")}</DataList.Label>
            <DataList.Value>
              {new Date(projectTier.project_tier.ends_at).toLocaleString(
                i18n.resolvedLanguage,
              )}
            </DataList.Value>
          </DataList.Item>
        </DataList>
      </Card>
    </Flex>
  );
};
