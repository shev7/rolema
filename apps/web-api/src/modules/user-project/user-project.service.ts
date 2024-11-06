import { Injectable } from "@nestjs/common";

import * as Services from "@repo/nest/services";

@Injectable()
export class UserProjectService extends Services.UserProjectService {}
