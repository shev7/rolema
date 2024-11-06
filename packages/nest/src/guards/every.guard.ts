import { CanActivate, ExecutionContext, mixin, Type } from "@nestjs/common";

export const EveryGuard = (...guards: Array<Type<CanActivate>>) => {
  class EveryMixin implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      return (
        await Promise.all(
          guards.map((guard) => guard.prototype.canActivate(context)),
        )
      ).every(Boolean);
    }
  }

  return mixin(EveryMixin);
};
