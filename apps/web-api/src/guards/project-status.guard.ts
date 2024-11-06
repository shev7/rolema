import { CanActivate, ExecutionContext, mixin } from "@nestjs/common";

import { RequestWithParameters } from "@repo/nest";
import { Project, queryProjects } from "@repo/database";

export const ProjectStatusGuard = (...statuses: Array<Project["status"]>) => {
  class ProjectStatusMixin implements CanActivate {
    async canActivate(context: ExecutionContext) {
      const { projectId } = context
        .switchToHttp()
        .getRequest<RequestWithParameters>();

      if (!projectId) {
        return false;
      }

      const [project] = await queryProjects({
        projectId,
        statuses,
      });

      return Boolean(project);
    }
  }

  return mixin(ProjectStatusMixin);
};
