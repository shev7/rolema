import NextLink from "next/link";

import { getServerTranslations } from "@repo/i18n";
import { Flex, Link, Table, Typography } from "@repo/ui";
import constants from "@repo/constants";
import { Project, ProjectRole } from "@repo/database";

import { Slide } from "./slide";

type ProjectRolesTableProps = {
  projectId: Project["id"];
  projectRoles: ProjectRole[];
};

export const ProjectRolesTable = async ({
  projectRoles,
  projectId,
}: ProjectRolesTableProps) => {
  const { t } = await getServerTranslations();

  if (!projectRoles.length) {
    return null;
  }

  return (
    <Table size="2" variant="surface" style={{ height: "fit-content" }}>
      <Table.Header>
        <Table.Row>
          <Table.RowHeaderCell align="left">
            <Slide delay={0} direction="right" duration={300}>
              {t("name")}
            </Slide>
          </Table.RowHeaderCell>
          <Table.RowHeaderCell align="center">
            <Slide delay={150} direction="right" duration={300}>
              {t("users")}
            </Slide>
          </Table.RowHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {projectRoles.map(({ id, name }) => (
          <Table.Row key={id}>
            <Table.RowHeaderCell>
              <Flex height="100%" align="center">
                <Slide direction="right" duration={300}>
                  <Link asChild>
                    <NextLink
                      href={constants.nav.routes.projectRole(id, projectId)}
                    >
                      {name}
                    </NextLink>
                  </Link>
                </Slide>
              </Flex>
            </Table.RowHeaderCell>
            <Table.RowHeaderCell align="center">
              <Flex align="center" justify="center" height="100%">
                <Slide direction="right" duration={300}>
                  <Typography>0</Typography>
                </Slide>
              </Flex>
            </Table.RowHeaderCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
