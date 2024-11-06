import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

import * as Services from "@repo/nest/services";

@Injectable()
export class MailService extends Services.MailService {
  constructor(mailerService: MailerService) {
    super(mailerService);
  }
}
