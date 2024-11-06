"use client";
import { CSSProperties } from "react";

import { useParams, usePathname, useRouter } from "next/navigation";

import { Box, Flex, TabNav } from "@repo/ui";
import constants from "@repo/constants";
import { useTranslation } from "@repo/i18n/hooks";
import { Project, Permission } from "@repo/database";

import { CurrentUser } from "@queries/query-current-user";
import { Slide } from "./slide";

export const SubHeader = ({
  currentUser,
  projects,
  permissions,
  usersByPermissionsCount,
}: {
  currentUser: CurrentUser;
  projects: Array<
    Pick<Project, "id" | "name" | "status"> & {
      users_count?: number;
      roles_count?: number;
    }
  >;
  permissions?: Permission[];
  usersByPermissionsCount?: number;
  isGeneralRole?: boolean;
}) => {
  const pathname = usePathname();
  const { projectId } = useParams<{
    projectId?: string;
  }>();

  const project = projects.find((project) => project.id === projectId);

  const showUsers =
    currentUser.role === "creator" ||
    Boolean(permissions?.some((permission) => permission.key === "role:read"));

  const { t } = useTranslation();

  const router = useRouter();

  const style: CSSProperties = {
    height: `calc(var(--tab-height) * 1.2)`,
    pointerEvents: project?.status !== "ready" ? "none" : undefined,
  };

  return (
    <Box>
      <style>
        {`
          .Tabs {
            padding-left: calc(16px * var(--scaling));
            padding-right: calc(16px * var(--scaling));
          }
        `}
      </style>
      <Flex>
        {projectId && (
          <TabNav
            style={{
              width: "100%",
            }}
            className="Tabs"
          >
            <Slide duration={150} delay={200}>
              <TabNav.Link
                style={style}
                href={constants.nav.routes.project(projectId)}
                active={pathname === constants.nav.routes.project(projectId)}
                onClick={(event) => {
                  event.preventDefault();
                  router.push(constants.nav.routes.project(projectId));
                }}
              >
                {t("overview")}
              </TabNav.Link>
            </Slide>
            {showUsers && (
              <Slide duration={150} delay={100}>
                <TabNav.Link
                  style={style}
                  href={constants.nav.routes.projectUsers(projectId)}
                  active={pathname.startsWith(
                    constants.nav.routes.projectUsers(projectId),
                  )}
                  onClick={(event) => {
                    event.preventDefault();
                    router.push(constants.nav.routes.projectUsers(projectId));
                  }}
                >
                  {t("users")}&nbsp;
                  {usersByPermissionsCount ?? project?.users_count}
                </TabNav.Link>
              </Slide>
            )}
            {currentUser.role === "creator" && (
              <>
                <Slide duration={150} delay={50}>
                  <TabNav.Link
                    style={style}
                    href={constants.nav.routes.projectRoles(projectId)}
                    active={pathname.startsWith(
                      constants.nav.routes.projectRoles(projectId),
                    )}
                    onClick={(event) => {
                      event.preventDefault();
                      router.push(constants.nav.routes.projectRoles(projectId));
                    }}
                  >
                    {t("roles")} {project?.roles_count}
                  </TabNav.Link>
                </Slide>
              </>
            )}
            <Slide duration={150} delay={50}>
              <TabNav.Link
                style={{ height: `calc(var(--tab-height) * 1.2)` }}
                href={constants.nav.routes.projectCalendar(projectId)}
                active={pathname.startsWith(
                  constants.nav.routes.projectCalendar(projectId),
                )}
                onClick={(event) => {
                  event.preventDefault();
                  router.push(constants.nav.routes.projectCalendar(projectId));
                }}
              >
                {t("calendar")}
              </TabNav.Link>
            </Slide>
            {currentUser.role === "creator" && (
              <>
                {!!projectId && (
                  <Slide duration={150}>
                    <TabNav.Link
                      style={{ height: `calc(var(--tab-height) * 1.2)` }}
                      href={constants.nav.routes.projectSettings(projectId)}
                      active={pathname.startsWith(
                        constants.nav.routes.projectSettings(projectId, false),
                      )}
                      onClick={(event) => {
                        event.preventDefault();
                        router.push(
                          constants.nav.routes.projectSettings(projectId),
                        );
                      }}
                    >
                      {t("settings")}
                    </TabNav.Link>
                  </Slide>
                )}
              </>
            )}
          </TabNav>
        )}
      </Flex>
    </Box>
  );
};
