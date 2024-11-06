import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

import { queryEvents } from "@repo/database";
import { RequestWithParameters } from "@repo/nest";

@Injectable()
export class EventOwnerGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const { user, eventId } = context
      .switchToHttp()
      .getRequest<RequestWithParameters>();

    if (!user || !eventId) {
      return false;
    }

    const [event] = await queryEvents({ eventId });

    return event?.created_by === user.id;
  }
}
