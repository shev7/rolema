import Link from "next/link";

import { getServerTranslations } from "@repo/i18n";
import {
  Button,
  ChevronLeftIcon,
  ChevronRightIcon,
  Flex,
  Typography,
} from "@repo/ui";
import { dayjs, formatDate } from "@repo/utils";
import constants from "@repo/constants";

import { Slide } from "@components/slide";

export const Title = async ({
  date,
  searchParams,
}: {
  date?: string;
  searchParams: Record<string, string>;
}) => {
  const { t } = await getServerTranslations();

  const dayjsDate = dayjs(date);
  const startOfWeek = dayjsDate.startOf("week");
  const endOfWeek = dayjsDate.endOf("week");
  const startOfWeekMonth = startOfWeek.format("MMM");
  const startOfWeekYear = startOfWeek.format("YYYY");
  const endOfWeekMonth = endOfWeek.format("MMM");
  const endOfWeekYear = endOfWeek.format("YYYY");

  return (
    <Flex flexGrow="1" align="center">
      <Slide direction="right" duration={300}>
        <Flex align="center" gap="4">
          <Flex gap="2">
            <Button variant="ghost" color="gray">
              <Link
                href={{
                  search: new URLSearchParams({
                    ...searchParams,
                    [constants.nav.sp.keys.date]: formatDate(
                      dayjsDate.subtract(7, "days"),
                      formatDate.Formats.DatetimeLocal,
                    ),
                  }).toString(),
                }}
              >
                <Flex>
                  <ChevronLeftIcon height={16} width={16} />
                </Flex>
              </Link>
            </Button>
            <Button variant="ghost" color="gray">
              <Link
                href={{
                  search: new URLSearchParams({
                    ...searchParams,
                    [constants.nav.sp.keys.date]: formatDate(
                      dayjsDate.add(7, "days"),
                      formatDate.Formats.DatetimeLocal,
                    ),
                  }).toString(),
                }}
              >
                <Flex>
                  <ChevronRightIcon height={16} width={16} />
                </Flex>
              </Link>
            </Button>
          </Flex>
          <Typography size="4">
            {startOfWeekMonth === endOfWeekMonth
              ? `${t(startOfWeek.format("MMMM").toLowerCase())}${startOfWeekYear !== endOfWeekYear ? ` ${startOfWeekYear}` : ""}`
              : `${t(startOfWeekMonth.toLowerCase())}${startOfWeekYear !== endOfWeekYear ? ` ${startOfWeekYear}` : ""} - ${t(endOfWeekMonth.toLowerCase())}`}
            {` ${endOfWeekYear}`}
          </Typography>
          <Button variant="outline" color="gray" asChild>
            <Link
              href={{
                search: new URLSearchParams({
                  ...searchParams,
                  [constants.nav.sp.keys.date]: formatDate(
                    dayjs(),
                    formatDate.Formats.DatetimeLocal,
                  ),
                }).toString(),
              }}
            >
              {t("today")}
            </Link>
          </Button>
        </Flex>
      </Slide>
    </Flex>
  );
};
