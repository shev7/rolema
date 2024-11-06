import { Controller, Get, UseGuards } from "@nestjs/common";

import constants from "@repo/constants";
import { Project } from "@repo/database";

import { ProjectOwnerGuard } from "@guards/project-owner.guard";

import { ProjectTierService } from "./project-tier.service";
import { ProjectIdParam } from "@repo/nest";

@Controller(`projects/:${constants.nav.sp.keys.projectId}/tier`)
export class ProjectTierController {
  constructor(private readonly projectTierService: ProjectTierService) {}

  @UseGuards(ProjectOwnerGuard("ready", "paused"))
  @Get()
  getProjectUser(
    @ProjectIdParam()
    projectId: Project["id"],
  ) {
    return this.projectTierService.getProjectTier({
      projectId,
    });
  }
}
