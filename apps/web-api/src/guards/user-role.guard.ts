import { CanActivate, ExecutionContext, mixin } from "@nestjs/common";

import { User } from "@repo/database";
import { RequestWithParameters } from "@repo/nest";

export const UserRoleGuard = (role: User["role"]) => {
  class UserRoleMixin implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const { user } = context
        .switchToHttp()
        .getRequest<RequestWithParameters>();

      return user?.role === role;
    }
  }

  return mixin(UserRoleMixin);
};
