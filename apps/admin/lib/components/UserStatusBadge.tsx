import { User } from "@repo/database";
import { getServerTranslations } from "@repo/i18n";
import { Badge, BadgeProps } from "@repo/ui";
import constants from "@repo/constants";

const statusColors: Record<
  (typeof constants.database.user.user_status)[number],
  BadgeProps["color"]
> = {
  pending: "blue",
  blocked: "gray",
  deleted: "red",
  ready: "green",
};

export const UserStatusBadge = async ({
  status,
  ...props
}: { status: User["status"] } & BadgeProps) => {
  const { t } = await getServerTranslations("common");

  return (
    <Badge color={statusColors[status]} {...props}>
      {t(status)}
    </Badge>
  );
};
