import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

import { queryEventParticipants } from "@repo/database";
import { RequestWithParameters } from "@repo/nest";

@Injectable()
export class EventParticipantGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const { user, eventId } = context
      .switchToHttp()
      .getRequest<RequestWithParameters>();

    if (!user || !eventId) {
      return false;
    }

    const [participant] = await queryEventParticipants({
      eventId,
      userId: user.id,
    });

    return Boolean(participant);
  }
}
