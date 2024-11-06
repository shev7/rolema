import { MailerService } from "@nestjs-modules/mailer";

import constants from "@repo/constants";
import { Project, User, UserEmailVerification } from "@repo/database";

type SendGeneralInvitationVariables = {
  toEmail: User["email"];
  projectName: Project["name"];
  projectId: Project["id"];
  token?: UserEmailVerification["token"] | null;
};

type SendCreatorInvitationVariables = {
  toEmail: User["email"];
  token: UserEmailVerification["token"];
};

export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  sendGeneralInvitation({
    toEmail,
    token,
    projectName,
    projectId,
  }: SendGeneralInvitationVariables) {
    return this.mailerService.sendMail({
      to: toEmail,
      subject: `You were invited to join ${projectName}`,
      template: "general-invitation.hbs",
      context: {
        projectName: projectName,
        inviterEmail: constants.config.MAILER_EMAIL,
        invitationLink: token
          ? `${constants.config.WEB_APP_URL}/register?token=${token}`
          : `${constants.config.WEB_APP_URL}/projects/${projectId}`,
      },
    });
  }

  sendCreatorInvitation({ toEmail, token }: SendCreatorInvitationVariables) {
    return this.mailerService.sendMail({
      to: toEmail,
      subject: "You were invited to join Rolema",
      template: "creator-invitation.hbs",
      context: {
        inviterEmail: constants.config.MAILER_EMAIL,
        invitationLink: `${constants.config.WEB_APP_URL}/register?token=${token}`,
      },
    });
  }
}
