import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

import { queryUserById } from "@repo/database";
import { getSession, createCookieStore } from "@repo/utils";
import constants from "@repo/constants";

import { RequestWithParameters } from "../types";

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithParameters>();

    const session = await getSession(
      createCookieStore(constants.cookies.session, request.cookies.session),
    );

    if (!session.user_id) {
      return false;
    }

    const user = await queryUserById(session.user_id);

    if (!user) {
      return false;
    }

    request.user = user;

    return true;
  }
}
