import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

import constants from "@repo/constants";

import { RequestWithParameters } from "../types";

@Injectable()
export class ParametersGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithParameters>();

    const { body, query, params } = request;

    request.projectId =
      body?.[constants.nav.sp.keys.projectId] ??
      query?.[constants.nav.sp.keys.projectId] ??
      params?.[constants.nav.sp.keys.projectId];

    request.projectRoleId =
      params[constants.nav.sp.keys.projectRoleId] ??
      body[constants.nav.sp.keys.projectRoleId];

    request.userId =
      body?.[constants.nav.sp.keys.userId] ??
      query?.[constants.nav.sp.keys.userId] ??
      params?.[constants.nav.sp.keys.userId];

    request.eventId =
      body?.[constants.nav.sp.keys.eventId] ??
      query?.[constants.nav.sp.keys.eventId] ??
      params?.[constants.nav.sp.keys.eventId];

    return true;
  }
}
