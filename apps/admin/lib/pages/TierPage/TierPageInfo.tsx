import { Tier } from "@repo/database";
import { getServerTranslations } from "@repo/i18n";
import { NextPageProps } from "@repo/types";
import { Card, DataList, Flex, Heading, Typography } from "@repo/ui";
import { getPrice } from "@repo/utils";

import { queryTier } from "@utils/queries";

export const TierPageInfo = async ({
  params: { tierId },
}: NextPageProps<{}, { tierId: Tier["id"] }>) => {
  const tier = await queryTier(tierId);

  const { t, i18n } = await getServerTranslations("common");

  return (
    <Flex gap="6">
      <Flex gap="6">
        <Card style={{ width: "fit-content" }}>
          <DataList>
            <DataList.Item align="center">
              <DataList.Label>ID</DataList.Label>
              <DataList.Value>{tier.id}</DataList.Value>
            </DataList.Item>

            <DataList.Item align="center">
              <DataList.Label>{t("name")}</DataList.Label>
              <DataList.Value>{tier.name}</DataList.Value>
            </DataList.Item>

            <DataList.Item align="center">
              <DataList.Label>{t("description")}</DataList.Label>
              <DataList.Value>{tier.description}</DataList.Value>
            </DataList.Item>

            <DataList.Item align="center">
              <DataList.Label>{t("users per project count")}</DataList.Label>
              <DataList.Value>{tier.users_per_project_count}</DataList.Value>
            </DataList.Item>

            <DataList.Item align="center">
              <DataList.Label>{t("roles per project count")}</DataList.Label>
              <DataList.Value>{tier.roles_per_project_count}</DataList.Value>
            </DataList.Item>
            <DataList.Item align="center">
              <DataList.Label>{t("price per month monthly")}</DataList.Label>
              <DataList.Value>
                {tier.price_per_month_monthly
                  .map(({ amountCents, currency }) =>
                    getPrice(amountCents, { currency }),
                  )
                  .join(", ")}
              </DataList.Value>
            </DataList.Item>
            <DataList.Item align="center">
              <DataList.Label>{t("price per month annually")}</DataList.Label>
              <DataList.Value>
                {tier.price_per_month_annually
                  .map(({ amountCents, currency }) =>
                    getPrice(amountCents, { currency }),
                  )
                  .join(", ")}
              </DataList.Value>
            </DataList.Item>

            <DataList.Item>
              <DataList.Label>{t("created at")}</DataList.Label>
              <DataList.Value>
                {new Date(tier.created_at).toLocaleString(
                  i18n.resolvedLanguage,
                )}
              </DataList.Value>
            </DataList.Item>

            <DataList.Item>
              <DataList.Label>{t("updated at")}</DataList.Label>
              <DataList.Value>
                {new Date(tier.updated_at).toLocaleString(
                  i18n.resolvedLanguage,
                )}
              </DataList.Value>
            </DataList.Item>
          </DataList>
        </Card>

        <Card style={{ width: "fit-content" }}>
          <Flex direction="column" gap="2">
            <Heading size="3">{t("benefits")}</Heading>
            {tier.benefits.length > 0 ? (
              <DataList>
                {tier.benefits.map((benefit, index) => (
                  <DataList.Item key={benefit} align="center">
                    <DataList.Value>
                      {index + 1}. {benefit}
                    </DataList.Value>
                  </DataList.Item>
                ))}
              </DataList>
            ) : (
              <Typography>{t("no benefits")}</Typography>
            )}
          </Flex>
        </Card>
      </Flex>
    </Flex>
  );
};
