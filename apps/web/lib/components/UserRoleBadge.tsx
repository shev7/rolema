import { User } from "@repo/database";
import { getServerTranslations } from "@repo/i18n";
import { Badge } from "@repo/ui";

export const UserRoleBadge = async ({ role }: { role: User["role"] }) => {
  const { t } = await getServerTranslations("common");

  const renderColor = () => {
    if (role === "admin") return "blue";
    if (role === "creator") return "green";

    return "gray";
  };

  return <Badge color={renderColor()}>{t(role)}</Badge>;
};
