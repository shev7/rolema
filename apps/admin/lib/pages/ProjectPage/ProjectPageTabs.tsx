"use client";

import { useParams, usePathname, useRouter } from "next/navigation";

import { TabNav } from "@repo/ui";
import constants from "@repo/constants";

export type UserPageTabsProps = {
  usersCount: number;
  informationTabTitle: string;
  usersTabTitle: string;
};

export const ProjectPageTabs = ({
  usersCount,
  informationTabTitle,
  usersTabTitle,
}: UserPageTabsProps) => {
  const router = useRouter();
  const { projectId } = useParams<{ projectId: string }>();
  const pathname = usePathname();
  const route = pathname.split("/").at(-1);
  const isInfoTab = route === "info";
  const isUsersTab = route === "users" && usersCount > 0;

  return (
    <TabNav style={{ width: "100%" }}>
      <TabNav.Link
        href={`${constants.nav.routes.project(projectId)}`}
        onClick={(event) => {
          event.preventDefault();
          router.push(`${constants.nav.routes.project(projectId)}`);
        }}
        active={isInfoTab}
      >
        {informationTabTitle}
      </TabNav.Link>
      <TabNav.Link
        style={{
          pointerEvents: usersCount === 0 ? "none" : undefined,
        }}
        href={`${constants.nav.routes.projectUsers(projectId)}`}
        onClick={(event) => {
          event.preventDefault();
          router.push(`${constants.nav.routes.projectUsers(projectId)}`);
        }}
        active={isUsersTab}
      >
        {usersTabTitle} ({usersCount})
      </TabNav.Link>
    </TabNav>
  );
};
