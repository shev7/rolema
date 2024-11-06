import { adminAPI } from "@api/admin";
import { QueryProjectsPerTierStatisticReturnType } from "@repo/database";

export const queryTiersStatistics = () => {
  return adminAPI.get<QueryProjectsPerTierStatisticReturnType>(
    `/tiers/statistics`,
    {
      cache: "no-cache",
    },
  );
};
