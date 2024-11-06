import { PropsWithChildren } from "react";

import { getServerTranslations } from "@repo/i18n";
import constants from "@repo/constants";

import { Page } from "@components/Page";
import { Menu } from "@components/menu";
import { NextLayoutProps } from "@repo/types";

export const ProjectSettingsPageLayout = async ({
  children,
  params: { projectId },
}: PropsWithChildren<NextLayoutProps<{ projectId: string }>>) => {
  const { t } = await getServerTranslations();

  return (
    <>
      <Page.Title title={t("settings")} />
      <Page.ContentWithMenu
        aside={
          <Menu
            options={[
              {
                href: constants.nav.routes.projectSettings(projectId),
                title: t("general settings"),
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
