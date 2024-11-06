import { Project } from "@repo/database";
import { getServerTranslations } from "@repo/i18n";
import { Badge, BadgeProps } from "@repo/ui";

export const projectStatusColors: Record<
  Project["status"],
  BadgeProps["color"]
> = {
  ready: "green",
  deleted: "red",
  paused: "gray",
  pending: "blue",
};

export const ProjectStatus = async ({
  status,
}: {
  status: Project["status"];
}) => {
  const { t } = await getServerTranslations("common");

  return (
    <Badge variant="soft" color={projectStatusColors[status]}>
      {t(status)}
    </Badge>
  );
};
