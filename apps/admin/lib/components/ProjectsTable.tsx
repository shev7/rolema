import Link from "next/link";

import { Button, Table } from "@repo/ui";
import constants from "@repo/constants";
import { getServerTranslations } from "@repo/i18n";
import { ProjectsServiceBase } from "@repo/nest";

import { ProjectStatus } from "./ProjectStatus";

type ProjectsTableProps = {
  projects: Awaited<ReturnType<ProjectsServiceBase["getProjects"]>>;
};

export const ProjectsTable = async ({ projects }: ProjectsTableProps) => {
  const { t, i18n } = await getServerTranslations("common");

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell align="center">
            {t("name")}
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell align="center">
            {t("status")}
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell align="center">
            {t("registered")}
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell align="center">
            {t("owner")}
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell align="right">
            {t("created by")}
          </Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {projects.map(
          ({ id, name, created_at, owner_id, created_by, status }) => (
            <Table.Row key={id}>
              <Table.RowHeaderCell>
                <Button variant="ghost" asChild>
                  <Link
                    href={constants.nav.routes.project(id)}
                    prefetch={false}
                  >
                    {id}
                  </Link>
                </Button>
              </Table.RowHeaderCell>
              <Table.Cell align="center">{name}</Table.Cell>
              <Table.Cell align="center">
                <ProjectStatus status={status} />
              </Table.Cell>
              <Table.Cell align="center">
                {new Date(created_at).toLocaleString(i18n.resolvedLanguage)}
              </Table.Cell>
              <Table.Cell align="center">
                <Button variant="ghost" asChild>
                  <Link
                    href={constants.nav.routes.userInfo(owner_id)}
                    prefetch={false}
                  >
                    {owner_id}
                  </Link>
                </Button>
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
