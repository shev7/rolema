import { ProjectStatistics } from "@queries/query-project-statistics";

import { getServerTranslations } from "@repo/i18n";
import { Card, Flex, Heading, Typography } from "@repo/ui";
import { dayjs } from "@repo/utils";
import { ProjectPausedModal } from "./project-paused-modal";
import { QueryProjectsReturnType } from "@repo/database";

export const InfoCard = async ({
  projectStatistics,
  project,
}: {
  projectStatistics: ProjectStatistics;
  project: NonNullable<QueryProjectsReturnType[number]>;
}) => {
  const { t } = await getServerTranslations();

  const isSubscriptionActive = dayjs().isBefore(
    projectStatistics.project_tier.ends_at,
  );
  const daysDifference = dayjs(projectStatistics.project_tier.ends_at).diff(
    new Date(),
    "days",
  );

  return (
    <Card>
      <Heading mb="4" size="6">
        {project.name}
      </Heading>
      <Typography
        dangerouslySetInnerHTML={{
          __html: t("project {{projectName}} was created at {{createdAt}}", {
            projectName: project.name,
            createdAt: dayjs(project.created_at).format(
              dayjs(projectStatistics.project_tier.ends_at, []).format(
                "DD.MM.YYYY",
              ),
            ),
          }),
        }}
      />
      <Flex justify="between" gap="6" align="center">
        {isSubscriptionActive ? (
          <Typography
            dangerouslySetInnerHTML={{
              __html: `${t("project has tier", {
                tierName: projectStatistics.tier.name,
                endsAt: dayjs(
                  projectStatistics.project_tier.ends_at,
                  [],
                ).format("DD.MM.YYYY HH:mm"),
              })}.`,
            }}
          />
        ) : (
          <>
            <Typography>
              <Typography color="red">{t("project is on hold")}.</Typography>
              &nbsp;
              <Typography>{t("renew your subscription")}</Typography>
            </Typography>
            <ProjectPausedModal project={project} />
          </>
        )}
        {isSubscriptionActive && (
          <Typography>
            {t("days left")}&nbsp;
            <Typography
              weight="medium"
              color={
                daysDifference > 20
                  ? "green"
                  : daysDifference > 7
                    ? "yellow"
                    : "red"
              }
            >
              {daysDifference}
            </Typography>
          </Typography>
        )}
      </Flex>
    </Card>
  );
};
