import { Module } from "@nestjs/common";

import { TierController } from "./tier.controller";
import { TierService } from "./tier.service";

@Module({
  controllers: [TierController],
  providers: [TierService],
  exports: [TierService],
})
export class TierModule {}
