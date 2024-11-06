import { NotFoundException } from "@nestjs/common";

import { queryTierById, updateTier } from "@repo/database";

import { TierServiceBase } from "../types";

export class TierService implements TierServiceBase {
  getTier: TierServiceBase["getTier"] = async (tierId) => {
    const tier = await queryTierById(tierId);

    if (!tier) {
      throw new NotFoundException("tier is not found");
    }

    return tier;
  };

  updateTier: TierServiceBase["updateTier"] = async (props) => {
    const tier = await updateTier(props);

    if (!tier) {
      throw new NotFoundException("tier is not found");
    }

    return tier;
  };
}
