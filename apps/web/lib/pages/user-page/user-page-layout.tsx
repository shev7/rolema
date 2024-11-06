import { PropsWithChildren } from "react";

import { notFound } from "next/navigation";

import { getServerTranslations } from "@repo/i18n";
import constants from "@repo/constants";
import { NextLayoutProps } from "@repo/types";
import { ChevronLeftIcon, Flex } from "@repo/ui";

import { queryProjectUser } from "@queries/query-project-user";

import { Menu } from "@components/menu";
import { Page } from "@components/Page";

export const UserPageLayout = async ({
  params: { userId, projectId },
  children,
}: PropsWithChildren<
  NextLayoutProps<{ userId: string; projectId: string }>
>) => {
  const [projectUser] = await Promise.all([
    queryProjectUser(projectId, userId),
  ]);

  if (!projectUser) {
    notFound();
  }

  const { t } = await getServerTranslations();

  return (
    <>
      <Page.Title title={projectUser?.user.email} />
      <Page.ContentWithMenu
        aside={
          <Menu
            options={[
              {
                href: constants.nav.routes.projectUsers(projectId),
                title: (
                  <Flex gap="1" align="center">
                    <ChevronLeftIcon />
                    {t("back to users")}
                  </Flex>
                ),
              },
              {
                href: constants.nav.routes.projectUser(projectId, userId),
                title: t("information"),
              },
              {
                href: constants.nav.routes.projectUserSettings(
                  projectId,
                  userId,
                ),
                title: t("settings"),
              },
            ]}
          />
        }
      >
        {children}
      </Page.ContentWithMenu>
    </>
  );
};
