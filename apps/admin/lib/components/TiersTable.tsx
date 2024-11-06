import Link from "next/link";

import { QueryTiersReturnType } from "@repo/database";
import { Button, Table } from "@repo/ui";
import constants from "@repo/constants";
import { getServerTranslations } from "@repo/i18n";

type TiersTableProps = {
  tiers: QueryTiersReturnType;
};

export const TiersTable = async ({ tiers }: TiersTableProps) => {
  const { t, i18n } = await getServerTranslations("common");

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell align="center">
            {t("name")}
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell align="right">
            {t("projects count")}
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell align="right">
            {t("users per project count")}
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell align="right">
            {t("roles per project count")}
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell align="center">
            {t("created at")}
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell align="right">
            {t("created by")}
          </Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {tiers.map(
          ({
            id,
            name,
            created_at,
            created_by,
            projects_count,
            users_per_project_count,
            roles_per_project_count,
          }) => (
            <Table.Row key={id}>
              <Table.RowHeaderCell>
                <Button variant="ghost" asChild>
                  <Link href={constants.nav.routes.tier(id)} prefetch={false}>
                    {id}
                  </Link>
                </Button>
              </Table.RowHeaderCell>
              <Table.Cell align="center">{name}</Table.Cell>
              <Table.Cell align="center">{projects_count}</Table.Cell>
              <Table.Cell align="center">{users_per_project_count}</Table.Cell>
              <Table.Cell align="center">{roles_per_project_count}</Table.Cell>
              <Table.Cell align="center">
                {new Date(created_at).toLocaleString(i18n.resolvedLanguage)}
              </Table.Cell>
              <Table.Cell align="right">
                <Button variant="ghost" asChild>
                  <Link
                    href={constants.nav.routes.userInfo(created_by)}
                    prefetch={false}
                  >
                    {created_by}
                  </Link>
                </Button>
              </Table.Cell>
            </Table.Row>
          ),
        )}
      </Table.Body>
    </Table>
  );
};
