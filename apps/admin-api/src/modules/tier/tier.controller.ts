import { Body, Controller, Get, Patch } from "@nestjs/common";

import { SessionUser, TierIdParam, ZodPipe } from "@repo/nest";
import { type UpdateTierSchema, updateTierSchema } from "@repo/validation";
import { type Tier, type User } from "@repo/database";
import constants from "@repo/constants";

import { TierService } from "./tier.service";

@Controller(`tiers/:${constants.nav.sp.keys.tierId}`)
export class TierController {
  constructor(private readonly tierService: TierService) {}

  @Get()
  getTier(
    @TierIdParam()
    tierId: Tier["id"],
  ) {
    return this.tierService.getTier(tierId);
  }

  @Patch()
  updateTier(
    @TierIdParam()
    tierId: Tier["id"],
    @Body(new ZodPipe(updateTierSchema))
    body: UpdateTierSchema,
    @SessionUser() user: User,
  ) {
    return this.tierService.updateTier({
      id: tierId,
      ...body,
      updated_by: user.id,
    });
  }
}
