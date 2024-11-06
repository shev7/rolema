import Link from "next/link";

import {
  ArrowLeftIcon,
  Box,
  ChangeLanguageDropdownItem,
  CheckIcon,
  DropdownMenu,
  FlagIcon,
  Flex,
  IconButton,
  MoonIcon,
  PersonIcon,
  SunIcon,
} from "@repo/ui";
import { languages } from "@repo/i18n/constants";
import { getServerTranslations, Languages } from "@repo/i18n";
import constants from "@repo/constants";

import { queryCurrentUser } from "@queries/query-current-user";
import { queryUserProjects } from "@queries/query-user-projects";
import { queryProjectsUser } from "@queries/query-projects-user";

import { logout } from "@actions/logout";
import { updateAppearance } from "@actions/update-appearance";

import { readCookie } from "@cookies/read";
import { readAppearance } from "@cookies/read-appearance";

import { SubHeader } from "./sub-header";
import { HeaderTitle } from "./header-title";

import { Project } from "@repo/database";
import { queryProjectUsersPermissions } from "@queries/query-project-users-permissions";
import { queryProjectRolePermissions } from "@queries/query-project-role-permissions";

type ProjectWithCounts = Project & {
  users_count: number;
  roles_count: number;
};

export const Header = async ({ projectId }: { projectId: Project["id"] }) => {
  const currentUser = await queryCurrentUser();
  const isGeneralRole = currentUser?.role === "general";

  if (!currentUser) {
    return null;
  }

  const [userProjects, projectUsers] = await Promise.all([
    queryUserProjects(currentUser.id),
    queryProjectsUser(currentUser.id),
  ]);

  const [permissions, usersByPermissions] = await Promise.all([
    currentUser.project_role_id
      ? queryProjectRolePermissions(currentUser.project_role_id)
      : undefined,
    isGeneralRole
      ? queryProjectUsersPermissions(projectId, currentUser.project_role_id!)
      : undefined,
  ]);

  const projects = [
    ...projectUsers.map(({ project: { id, name, status } }) => ({
      id,
      name,
      status,
    })),
    ...(userProjects as ProjectWithCounts[]).map(
      ({ id, name, status, users_count, roles_count }) => ({
        id,
        name,
        status,
        users_count,
        roles_count,
      }),
    ),
  ];

  const { t, i18n } = await getServerTranslations("common");

  const projectCookie = readCookie(constants.cookies.project);
  const appearance = readAppearance();

  return (
    <header
      style={{
        zIndex: 10,
        top: 0,
        position: "fixed",
        width: "100%",
        backgroundColor: "var(--background-accent)",
      }}
    >
      <Box
        py="4"
        pr="6"
        style={{
          paddingLeft: "calc(20px * var(--scaling))",
        }}
      >
        <Flex align="center" justify="between">
          <HeaderTitle projects={projects} projectCookie={projectCookie} />
          <Flex align="center" gap="5">
            <DropdownMenu>
              <DropdownMenu.Trigger>
                <IconButton variant="ghost">
                  <PersonIcon />
                </IconButton>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <Link href={constants.nav.routes.account()}>
                  <DropdownMenu.Item>
                    <PersonIcon />
                    {t("account")}
                  </DropdownMenu.Item>
                </Link>
                <DropdownMenu.Separator />
                <DropdownMenu.Sub>
                  <DropdownMenu.SubTrigger>
                    <FlagIcon
                      language={i18n.resolvedLanguage as Languages[number]}
                    />
                    {i18n.resolvedLanguage}
                  </DropdownMenu.SubTrigger>
                  <DropdownMenu.SubContent>
                    {languages.map((language) => (
                      <ChangeLanguageDropdownItem
                        key={language}
                        language={language}
                      />
                    ))}
                  </DropdownMenu.SubContent>
                </DropdownMenu.Sub>
                <DropdownMenu.Separator />
                <DropdownMenu.Sub>
                  <DropdownMenu.SubTrigger>
                    {appearance === "light" ? <SunIcon /> : <MoonIcon />}
                    {t(appearance)}
                  </DropdownMenu.SubTrigger>
                  <DropdownMenu.SubContent>
                    <form
                      action={async () => {
                        "use server";

                        await updateAppearance("light");
                      }}
                    >
                      <DropdownMenu.Item disabled={appearance === "light"}>
                        <button type="submit" style={{ width: "100%" }}>
                          <Flex gap="2" align="center" width="100%">
                            <SunIcon />
                            <Flex gap="2" align="center">
                              {t("light")}
                              {appearance === "light" && <CheckIcon />}
                            </Flex>
                          </Flex>
                        </button>
                      </DropdownMenu.Item>
                    </form>
                    <form
                      action={async () => {
                        "use server";

                        await updateAppearance("dark");
                      }}
                    >
                      <DropdownMenu.Item disabled={appearance === "dark"}>
                        <button type="submit" style={{ width: "100%" }}>
                          <Flex gap="2" align="center" width="100%">
                            <MoonIcon />
                            <Flex gap="2" align="center">
                              {t("dark")}
                              {appearance === "dark" && <CheckIcon />}
                            </Flex>
                          </Flex>
                        </button>
                      </DropdownMenu.Item>
                    </form>
                  </DropdownMenu.SubContent>
                </DropdownMenu.Sub>
                <DropdownMenu.Separator />
                <form action={logout}>
                  <button type="submit" style={{ width: "100%" }}>
                    <DropdownMenu.Item color="red">
                      <ArrowLeftIcon />
                      {t("logout")}
                    </DropdownMenu.Item>
                  </button>
                </form>
              </DropdownMenu.Content>
            </DropdownMenu>
          </Flex>
        </Flex>
      </Box>
      <SubHeader
        permissions={permissions}
        currentUser={currentUser}
        projects={projects}
        usersByPermissionsCount={usersByPermissions?.length}
      />
    </header>
  );
};
