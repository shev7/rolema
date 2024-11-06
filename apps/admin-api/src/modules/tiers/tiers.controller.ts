import { Controller, Get } from "@nestjs/common";

import { TiersService } from "./tiers.service";

@Controller(`tiers`)
export class TiersController {
  constructor(private readonly tiersService: TiersService) {}

  @Get(`statistics`)
  getStatistics() {
    return this.tiersService.getStatistics();
  }

  @Get()
  getAll() {
    return this.tiersService.getAll();
  }
}
