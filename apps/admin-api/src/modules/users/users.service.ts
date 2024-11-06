import { Injectable } from "@nestjs/common";

import * as Services from "@repo/nest/services";

import { MailService } from "../mail";

@Injectable()
export class UsersService extends Services.UsersService {
  constructor(mailService: MailService) {
    super(mailService);
  }
}
