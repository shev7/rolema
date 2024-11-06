import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

import { RequestWithParameters } from "@repo/nest";
import { queryProjectByProjectRoleId } from "@repo/database";

@Injectable()
export class ProjectRoleGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const { user, projectRoleId } = context
      .switchToHttp()
      .getRequest<RequestWithParameters>();

    if (!projectRoleId || !user) {
      return false;
    }

    const data = await queryProjectByProjectRoleId(projectRoleId);

    return data?.project?.owner_id === user.id;
  }
}
