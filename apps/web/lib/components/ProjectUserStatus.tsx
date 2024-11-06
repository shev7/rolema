import { ProjectUser } from "@repo/database";
import { getServerTranslations } from "@repo/i18n";
import { Badge, BadgeProps, Tooltip } from "@repo/ui";

export const projectUserStatusColors: Record<
  ProjectUser["status"],
  BadgeProps["color"]
> = {
  pending: "blue",
  ready: "green",
  deleted: "red",
  blocked: "gray",
};

export const ProjectUserStatus = async ({
  status,
}: {
  status: ProjectUser["status"];
}) => {
  const { t } = await getServerTranslations("common");

  return (
    <Tooltip
      content={
        status === "pending"
          ? "Account is not verified yet"
          : status === "ready"
            ? "Account is ready for use"
            : "Account is blocked from the project"
      }
    >
      <Badge variant="soft" color={projectUserStatusColors[status]}>
        {t(status)}
      </Badge>
    </Tooltip>
  );
};
