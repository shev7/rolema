import { User } from "@repo/database";
import { getServerTranslations } from "@repo/i18n";
import { Badge } from "@repo/ui";

type UserStatusBadgeProps = {
  status: User["status"];
};

export const UserStatusBadge = async ({ status }: UserStatusBadgeProps) => {
  const { t } = await getServerTranslations("common");

  return (
    <Badge color={status === "ready" ? "green" : "gray"}>{t(status)}</Badge>
  );
};
