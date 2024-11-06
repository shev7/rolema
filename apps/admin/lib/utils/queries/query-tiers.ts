import { adminAPI } from "@api/admin";
import { QueryTiersReturnType } from "@repo/database";

export const queryTiers = () => {
  return adminAPI.get<QueryTiersReturnType>(`/tiers`, {
    cache: "no-cache",
  });
};
