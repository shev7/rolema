import { Page } from "@components/Page";

import { getServerTranslations } from "@repo/i18n";
import { NextPageProps } from "@repo/types";
import { Typography } from "@repo/ui";

export const AccessDeniedPage = async ({
  searchParams: { message },
}: NextPageProps<{
  message?: string;
}>) => {
  const { t } = await getServerTranslations("common");

  return (
    <>
      <Page.Title title={t("access denied")} />
      <Page.Content>
        <Typography color="red">
          {t(message ?? "") ?? t("something went wrong")}
        </Typography>
      </Page.Content>
    </>
  );
};
