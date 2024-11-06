import { Injectable } from "@nestjs/common";

import * as Services from "@repo/nest/services";

@Injectable()
export class ProjectsService extends Services.ProjectsService {}
