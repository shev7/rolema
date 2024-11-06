import { NextPageProps } from "@repo/types";
import { getServerTranslations } from "@repo/i18n";

import constants from "@repo/constants";

import { Page } from "@components/Page";

import { Slide } from "@components/slide";

import { Content } from "./components/content";
import { Title } from "./components/title";
import { CalendarContextProviver } from "./components/calendar-context";

export const ProjectCalendarPage = async ({
  params: { projectId },
  searchParams: { [constants.nav.sp.keys.date]: date },
  searchParams,
}: NextPageProps<
  {
    [constants.nav.sp.keys.date]?: string;
  },
  { projectId: string }
>) => {
  const { t } = await getServerTranslations();

  return (
    <>
      <Page.Title title={t("calendar")}>
        <Title date={date} searchParams={searchParams} />
      </Page.Title>

      <Page.Content>
        <Slide direction="right" duration={300}>
          <CalendarContextProviver>
            <Content projectId={projectId} date={date} />
          </CalendarContextProviver>
        </Slide>
      </Page.Content>
    </>
  );
};
