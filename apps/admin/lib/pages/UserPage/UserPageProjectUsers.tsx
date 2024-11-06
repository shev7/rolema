import { redirect, RedirectType } from "next/navigation";
import Link from "next/link";

import { getServerTranslations } from "@repo/i18n";
import { NextPageProps } from "@repo/types";
import constants from "@repo/constants";
import { Badge, Button, Table } from "@repo/ui";

import { queryProjectsUser } from "@utils/queries";

export const UserPageProjectUsers = async ({
  params: { userId },
}: NextPageProps<{}, { userId: string }>) => {
  const { t } = await getServerTranslations();

  const [projectUsers] = await Promise.all([queryProjectsUser(userId)]);

  if (projectUsers.length === 0) {
    redirect(`${constants.nav.routes.userInfo(userId)}`, RedirectType.replace);
  }

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>{t("project")}</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell align="center">
            {t("role")}
          </Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {projectUsers.map(
          ({
            project_user: { project_id, user_id },
            project_role: { name },
          }) => (
            <Table.Row key={user_id}>
              <Table.RowHeaderCell>
                <Button variant="ghost" asChild>
                  <Link
                    href={constants.nav.routes.project(project_id)}
                    prefetch={false}
                  >
                    {project_id}
                  </Link>
                </Button>
              </Table.RowHeaderCell>
              <Table.RowHeaderCell align="center">
                <Badge color="bronze">{name}</Badge>
              </Table.RowHeaderCell>
            </Table.Row>
          ),
        )}
      </Table.Body>
    </Table>
  );
};
