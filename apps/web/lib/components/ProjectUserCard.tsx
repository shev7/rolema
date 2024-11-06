import { QueryProjectUsersReturnType } from "@repo/database";
import { getServerTranslations } from "@repo/i18n";
import { Badge, Card, CheckIcon, Cross2Icon, DataList, Flex } from "@repo/ui";

import { ProjectUserStatus } from "./ProjectUserStatus";
import { dayjs } from "@repo/utils";

type UserCardProps = {
  projectUser: QueryProjectUsersReturnType[number];
};

export const ProjectUserCard = async ({ projectUser }: UserCardProps) => {
  const { t } = await getServerTranslations("common");
  const { user_info, project_user, project_role } = projectUser;

  return (
    <Flex gap="6">
      <Card style={{ width: "fit-content" }}>
        <DataList>
          <DataList.Item>
            <DataList.Label>{t("email verified")}</DataList.Label>
            <DataList.Value>
              <Badge color={user_info.email_verified ? "green" : "red"}>
                {user_info.email_verified ? <CheckIcon /> : <Cross2Icon />}
              </Badge>
            </DataList.Value>
          </DataList.Item>

          {user_info.email_verified && user_info.email_verified_at && (
            <DataList.Item>
              <DataList.Label>{t("email verified at")}</DataList.Label>
              <DataList.Value>
                {dayjs(user_info.email_verified_at).format("DD.MM.YYYY")}
              </DataList.Value>
            </DataList.Item>
          )}

          <DataList.Item>
            <DataList.Label>{t("project role")}</DataList.Label>
            <DataList.Value style={{ marginLeft: "auto" }}>
              <Badge color="bronze">{project_role.name}</Badge>
            </DataList.Value>
          </DataList.Item>

          <DataList.Item align="center">
            <DataList.Label>{t("status")}</DataList.Label>
            <DataList.Value style={{ marginLeft: "auto" }}>
              <ProjectUserStatus status={project_user.status} />
            </DataList.Value>
          </DataList.Item>

          <DataList.Item>
            <DataList.Label>{t("joined project")}</DataList.Label>
            <DataList.Value>
              {dayjs(project_user.created_at).format("DD.MM.YYYY")}
            </DataList.Value>
          </DataList.Item>
        </DataList>
      </Card>
    </Flex>
  );
};
