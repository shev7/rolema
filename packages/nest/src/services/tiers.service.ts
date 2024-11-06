import { queryProjectsPerTierStatistic, queryTiers } from "@repo/database";

import { TiersServiceBase } from "../types";

export class TiersService implements TiersServiceBase {
  getStatistics: TiersServiceBase["getStatistics"] = () => {
    return queryProjectsPerTierStatistic();
  };

  getAll: TiersServiceBase["getAll"] = () => {
    return queryTiers();
  };
}
