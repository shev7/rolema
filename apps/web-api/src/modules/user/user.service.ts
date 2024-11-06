import { Injectable } from "@nestjs/common";

import * as Services from "@repo/nest/services";

@Injectable()
export class UserService extends Services.UserService {}
