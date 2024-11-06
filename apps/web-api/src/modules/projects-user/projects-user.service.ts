import { Injectable } from "@nestjs/common";

import * as Services from "@repo/nest/services";

@Injectable()
export class ProjectsUserService extends Services.ProjectsUserService {}
