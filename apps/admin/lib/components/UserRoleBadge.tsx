import { User } from "@repo/database";
import { getServerTranslations } from "@repo/i18n";
import { Badge, BadgeProps } from "@repo/ui";

export const UserRoleBadge = async ({
  role,
  ...props
}: { role: User["role"] } & BadgeProps) => {
  const { t } = await getServerTranslations("common");

  return (
    <Badge
      color={role === "admin" ? "blue" : role === "creator" ? "green" : "gray"}
      {...props}
    >
      {t(role)}
    </Badge>
  );
};
