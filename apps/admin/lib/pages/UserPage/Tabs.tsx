"use client";

import { useParams, usePathname, useRouter } from "next/navigation";

import { TabNav } from "@repo/ui";
import constants from "@repo/constants";

export type TabsProps = {
  projectsCount: number;
  projectUsersCount: number;
  informationTabTitle: string;
  projectsTabTitle: string;
  projectUserTabTitle: string;
};

export const Tabs = ({
  projectsCount,
  projectUsersCount,
  informationTabTitle,
  projectsTabTitle,
  projectUserTabTitle,
}: TabsProps) => {
  const router = useRouter();
  const { userId } = useParams<{ userId: string }>();
  const pathname = usePathname();

  const page = pathname.split("/").at(-1);

  const isProjectsPage = page === "projects" && projectsCount > 0;
  const isProjectUsersPage = page === "project-users";
  const isInfoPage = !isProjectsPage && !isProjectUsersPage;
  const userInfoHref = constants.nav.routes.userInfo(userId);
  const userProjectsHref = constants.nav.routes.userProjects(userId);
  const userProjectUsersHref = constants.nav.routes.userProjectUsers(userId);

  return (
    <TabNav style={{ width: "100%" }}>
      <TabNav.Link
        href={userInfoHref}
        onClick={(event) => {
          event.preventDefault();
          router.push(userInfoHref);
        }}
        active={isInfoPage}
      >
        {informationTabTitle}
      </TabNav.Link>
      <TabNav.Link
        style={{
          pointerEvents: projectsCount === 0 ? "none" : undefined,
        }}
        href={userProjectsHref}
        onClick={(event) => {
          event.preventDefault();
          router.push(userProjectsHref);
        }}
        active={isProjectsPage}
      >
        {projectsTabTitle} ({projectsCount})
      </TabNav.Link>
      <TabNav.Link
        style={{
          pointerEvents: projectUsersCount === 0 ? "none" : undefined,
        }}
        href={userProjectUsersHref}
        onClick={(event) => {
          event.preventDefault();
          router.push(userProjectUsersHref);
        }}
        active={isProjectUsersPage}
      >
        {projectUserTabTitle} ({projectUsersCount})
      </TabNav.Link>
    </TabNav>
  );
};
