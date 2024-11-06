import { Module } from "@nestjs/common";

import { ProjectTierService } from "./project-tier.service";
import { ProjectTierController } from "./project-tier.controller";

@Module({
  controllers: [ProjectTierController],
  providers: [ProjectTierService],
  exports: [ProjectTierService],
})
export class ProjectTierModule {}
