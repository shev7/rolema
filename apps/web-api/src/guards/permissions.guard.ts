import { CanActivate, ExecutionContext, mixin } from "@nestjs/common";

import { RequestWithParameters } from "@repo/nest";
import {
  Permission,
  queryPermissions,
  queryProjectByProjectRoleId,
  queryProjectRoleByUserId,
} from "@repo/database";

export const PermissionsGuard = (key: Permission["key"]) => {
  class PermissionsMixin implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const {
        user,
        projectId: projectIdParameter,
        projectRoleId,
        userId,
      } = context.switchToHttp().getRequest<RequestWithParameters>();

      let projectId = projectIdParameter;

      if (!user || (!projectId && !projectRoleId)) {
        return false;
      }

      if (!projectId && projectRoleId) {
        const data = await queryProjectByProjectRoleId(projectRoleId);

        if (!data?.project) {
          return false;
        }

        projectId = data.project.id;
      }

      if (!projectId) {
        return false;
      }

      const projectRole = await queryProjectRoleByUserId({
        userId: user.id,
        projectId,
      });

      if (!projectRole) {
        return false;
      }

      const permissions = await queryPermissions({
        keys: [key],
        permissionProjectRoleId: projectRole.id,
      });

      if (!permissions.length) {
        return false;
      }

      if (userId) {
        const userProjectRole = await queryProjectRoleByUserId({
          userId,
          projectId,
        });

        if (!userProjectRole) {
          return false;
        }

        return !!permissions.find(
          (permission) =>
            permission.project_id === projectId ||
            permission.project_role_id === userProjectRole.id,
        );
      }

      if (projectRoleId) {
        return !!permissions.find(
          (permission) =>
            permission.project_id === projectId ||
            permission.project_role_id === projectRoleId,
        );
      }

      return !!permissions.find(
        (permission) =>
          permission.project_id === projectId ||
          permission.project_role_id === projectRole.id,
      );
    }
  }

  return mixin(PermissionsMixin);
};
