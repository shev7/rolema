import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { queryProjectUser } from "@repo/database";

import { RequestWithParameters } from "@repo/nest";

@Injectable()
export class ProjectUserGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const { projectId, userId } = context
      .switchToHttp()
      .getRequest<RequestWithParameters>();

    if (!projectId || !userId) {
      return false;
    }

    const projectUser = await queryProjectUser({ userId, projectId });

    return Boolean(projectUser);
  }
}
