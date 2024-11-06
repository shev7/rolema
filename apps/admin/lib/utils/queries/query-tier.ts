import { adminAPI } from "@api/admin";
import { QueryTierByIdReturnType, Tier } from "@repo/database";

export const queryTier = (tierId: Tier["id"]) => {
  return adminAPI.get<NonNullable<QueryTierByIdReturnType>>(
    `/tiers/${tierId}`,
    {
      cache: "no-cache",
    },
  );
};
