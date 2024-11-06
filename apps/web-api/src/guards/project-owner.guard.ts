import { CanActivate, ExecutionContext, mixin } from "@nestjs/common";

import { RequestWithParameters } from "@repo/nest";
import { Project, queryProjects } from "@repo/database";

export const ProjectOwnerGuard = (...statuses: Array<Project["status"]>) => {
  class ProjectOwnerMixin implements CanActivate {
    async canActivate(context: ExecutionContext) {
      const { user, projectId, userId } = context
        .switchToHttp()
        .getRequest<RequestWithParameters>();

      if (!projectId || !user) {
        return false;
      }

      const [project] = await queryProjects({
        projectId,
        userId,
        ownerId: user.id,
        statuses: statuses.length ? statuses : undefined,
      });

      return Boolean(project);
    }
  }

  return mixin(ProjectOwnerMixin);
};
