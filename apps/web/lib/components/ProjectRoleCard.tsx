import { ProjectRole } from "@repo/database";
import { getServerTranslations } from "@repo/i18n";
import { Card, DataList, Flex } from "@repo/ui";
import { Slide } from "./slide";

type ProjectRoleCardProps = {
  projectRole: ProjectRole;
};

export const ProjectRoleCard = async ({
  projectRole,
}: ProjectRoleCardProps) => {
  const { t, i18n } = await getServerTranslations("common");
  const { created_at } = projectRole;

  return (
    <Flex gap="6">
      <Slide duration={300} direction="right">
        <Card style={{ width: "fit-content" }}>
          <DataList>
            <DataList.Item>
              <DataList.Label>{t("created at")}</DataList.Label>
              <DataList.Value>
                {new Date(created_at).toLocaleString(i18n.resolvedLanguage)}
              </DataList.Value>
            </DataList.Item>
          </DataList>
        </Card>
      </Slide>
    </Flex>
  );
};
