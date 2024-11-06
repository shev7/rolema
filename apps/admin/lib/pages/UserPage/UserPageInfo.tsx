import Link from "next/link";

import { getServerTranslations } from "@repo/i18n";
import { NextPageProps } from "@repo/types";
import {
  Badge,
  Button,
  Card,
  CheckIcon,
  Cross2Icon,
  DataList,
  Flex,
} from "@repo/ui";
import constants from "@repo/constants";

import { UserRoleBadge } from "@components/UserRoleBadge";
import { UserStatusBadge } from "@components/UserStatusBadge";
import { DeleteUserForm } from "./components";
import { queryUser } from "@utils/queries";

export const UserPageInfo = async ({
  params: { userId },
}: NextPageProps<{}, { userId: string }>) => {
  const { t, i18n } = await getServerTranslations("common");

  const [user] = await Promise.all([queryUser(userId)]);

  return (
    <Flex gap="6">
      <Flex direction="column" gap="6">
        <Card style={{ width: "fit-content" }}>
          <DataList>
            <DataList.Item align="center">
              <DataList.Label>ID</DataList.Label>
              <DataList.Value>{user.id}</DataList.Value>
            </DataList.Item>

            <DataList.Item align="center">
              <DataList.Label>{t("email")}</DataList.Label>
              <DataList.Value>{user.email}</DataList.Value>
            </DataList.Item>

            <DataList.Item align="center">
              <DataList.Label>{t("role")}</DataList.Label>
              <DataList.Value>
                <UserRoleBadge role={user.role} />
              </DataList.Value>
            </DataList.Item>

            <DataList.Item align="center">
              <DataList.Label>{t("status")}</DataList.Label>
              <DataList.Value>
                <UserStatusBadge status={user.status} />
              </DataList.Value>
            </DataList.Item>

            <DataList.Item>
              <DataList.Label>{t("invited by")}</DataList.Label>
              <DataList.Value>
                <Button variant="ghost" asChild>
                  <Link
                    href={constants.nav.routes.userInfo(user.invited_by)}
                    prefetch={false}
                  >
                    {user.invited_by}
                  </Link>
                </Button>
              </DataList.Value>
            </DataList.Item>

            <DataList.Item>
              <DataList.Label>{t("email verified")}</DataList.Label>
              <DataList.Value>
                <Badge color={user.email_verified ? "green" : "red"}>
                  {user.email_verified ? <CheckIcon /> : <Cross2Icon />}
                </Badge>
              </DataList.Value>
            </DataList.Item>

            {user.email_verified && user.email_verified_at && (
              <DataList.Item>
                <DataList.Label>{t("email verified at")}</DataList.Label>
                <DataList.Value>
                  {new Date(user.email_verified_at).toLocaleString(
                    i18n.resolvedLanguage,
                  )}
                </DataList.Value>
              </DataList.Item>
            )}

            <DataList.Item>
              <DataList.Label>{t("registered")}</DataList.Label>
              <DataList.Value>
                {new Date(user.created_at).toLocaleString(
                  i18n.resolvedLanguage,
                )}
              </DataList.Value>
            </DataList.Item>

            <DataList.Item>
              <DataList.Label>{t("updated at")}</DataList.Label>
              <DataList.Value>
                {new Date(user.updated_at).toLocaleString(
                  i18n.resolvedLanguage,
                )}
              </DataList.Value>
            </DataList.Item>
          </DataList>
        </Card>
        {!user.email_verified && user.role !== "general" && (
          <DeleteUserForm userId={user.id} />
        )}
      </Flex>
    </Flex>
  );
};
