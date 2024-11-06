import NextLink from "next/link";

import {
  Badge,
  Callout,
  Flex,
  InfoCircledIcon,
  Link,
  Table,
  Typography,
} from "@repo/ui";
import constants from "@repo/constants";
import { getServerTranslations } from "@repo/i18n";
import { QueryProjectUsersReturnType } from "@repo/database";

import { ProjectUserStatus } from "./ProjectUserStatus";
import { Slide } from "./slide";

type UsersTableProps = {
  projectUsers: QueryProjectUsersReturnType;
  showHeader?: boolean;
};

export const UsersTable = async ({
  projectUsers,
  showHeader = true,
}: UsersTableProps) => {
  const { t } = await getServerTranslations();

  if (projectUsers.length === 0) {
    return (
      <Slide duration={300} style={{ width: "100%" }} direction="right">
        <Callout
          color="gray"
          style={{
            width: "fit-content",
            height: "fit-content",
            margin: "0 auto",
          }}
        >
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>
            No one's been invited yet.
            <br />
            <br />
            You can have up to 1000 people in your project.
            <br />
            If you want more - talk to your project coordinator.
          </Callout.Text>
        </Callout>
      </Slide>
    );
  }

  return (
    <Slide duration={300} style={{ width: "100%" }} direction="right">
      <Table
        size="2"
        variant="surface"
        style={{ height: "fit-content", width: "100%" }}
      >
        {showHeader && (
          <Table.Header>
            <Table.Row>
              <Table.RowHeaderCell>
                <Slide delay={0} direction="right" duration={300}>
                  {t("email")}
                </Slide>
              </Table.RowHeaderCell>
              <Table.RowHeaderCell align="center">
                <Slide delay={150} direction="right" duration={300}>
                  {t("email verified")}
                </Slide>
              </Table.RowHeaderCell>
              <Table.RowHeaderCell align="center">
                <Slide delay={300} direction="right" duration={300}>
                  {t("status")}
                </Slide>
              </Table.RowHeaderCell>
              <Table.RowHeaderCell align="center">
                <Slide delay={450} direction="right" duration={300}>
                  {t("role")}
                </Slide>
              </Table.RowHeaderCell>
            </Table.Row>
          </Table.Header>
        )}

        <Table.Body>
          {projectUsers.map(
            ({
              user: { id, email },
              project_role,
              user_info: { email_verified },
              project_user: { status, project_id },
            }) => (
              <Table.Row key={id}>
                <Table.RowHeaderCell>
                  <Flex height="100%" align="center">
                    <Slide direction="right" duration={300}>
                      <Link color="blue" size="2" asChild>
                        <NextLink
                          href={constants.nav.routes.user(id, project_id)}
                          color="blue"
                        >
                          {email}
                        </NextLink>
                      </Link>
                    </Slide>
                  </Flex>
                </Table.RowHeaderCell>
                <Table.RowHeaderCell align="center">
                  <Slide direction="right" duration={300}>
                    {email_verified ? (
                      <Typography color="green" align="left">
                        {t("email verified")}
                      </Typography>
                    ) : (
                      <Typography color="red" align="left">
                        {t("email is not verified")}
                      </Typography>
                    )}
                  </Slide>
                </Table.RowHeaderCell>
                <Table.RowHeaderCell align="center">
                  <Flex align="center" height="100%" justify="center">
                    <Slide direction="right" duration={300}>
                      <ProjectUserStatus status={status} />
                    </Slide>
                  </Flex>
                </Table.RowHeaderCell>
                <Table.RowHeaderCell align="center">
                  <Flex align="center" height="100%" justify="center">
                    <Slide direction="right" duration={300}>
                      <Badge color="bronze">{project_role.name}</Badge>
                    </Slide>
                  </Flex>
                </Table.RowHeaderCell>
              </Table.Row>
            ),
          )}
        </Table.Body>
      </Table>
    </Slide>
  );
};
