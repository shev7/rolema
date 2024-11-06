import { join } from "path";
import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";

import constants from "@repo/constants";

import { MailService } from "./mail.service";

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          service: constants.config.MAILER_SERVICE,
          auth: {
            user: constants.config.MAILER_EMAIL,
            pass: constants.config.MAILER_PASSWORD,
          },
        },
        defaults: {
          from: `"No Reply" <${constants.config.MAILER_EMAIL}>`,
        },
        template: {
          dir: join(__dirname, "templates"),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
