import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

import { RequestWithParameters } from "@repo/nest";

@Injectable()
export class UserOwnerGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const { user, userId } = context
      .switchToHttp()
      .getRequest<RequestWithParameters>();

    return !!user && !!userId && user.id === userId;
  }
}
