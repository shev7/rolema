import { CanActivate, ExecutionContext, mixin } from "@nestjs/common";

import { User } from "@repo/database";

import { RequestWithParameters } from "../types";

export const RolesGuard = (...roles: Array<User["role"]>) => {
  class RolesGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const { user } = context
        .switchToHttp()
        .getRequest<RequestWithParameters>();

      return !!user && roles.includes(user.role);
    }
  }

  return mixin(RolesGuardMixin);
};
