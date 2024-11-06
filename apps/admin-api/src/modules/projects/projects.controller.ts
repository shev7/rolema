import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";

import {
  createProjectSchema,
  type CreateProjectSchema,
} from "@repo/validation";
import { ZodPipe } from "@repo/nest/pipes";
import { type User } from "@repo/database";
import { SessionUser } from "@repo/nest/decorators";

import { ProjectsService } from "./projects.service";

@Controller(`projects`)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get(`statistics`)
  getStatistics() {
    return this.projectsService.getStatistics();
  }

  @Get()
  getProjects() {
    return this.projectsService.getProjects();
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  createProject(
    @Body(new ZodPipe(createProjectSchema))
    body: CreateProjectSchema,
    @SessionUser() user: User,
  ) {
    return this.projectsService.createProject({
      ...body,
      createdBy: user.id,
    });
  }
}
