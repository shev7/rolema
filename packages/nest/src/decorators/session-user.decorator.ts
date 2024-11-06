import { ExecutionContext, createParamDecorator } from "@nestjs/common";

import { RequestWithParameters } from "../types";

export const SessionUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) =>
    ctx.switchToHttp().getRequest<RequestWithParameters>().user,
);
