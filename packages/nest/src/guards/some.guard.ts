import { CanActivate, ExecutionContext, mixin, Type } from "@nestjs/common";

export const SomeGuard = (...guards: Array<Type<CanActivate>>) => {
  class OneOfMixin implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      for (const guard of guards) {
        if (await guard.prototype.canActivate(context)) {
          return true;
        }
      }

      return false;
    }
  }

  return mixin(OneOfMixin);
};
