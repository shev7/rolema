import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { DatabaseError } from "pg";

import {
  ProjectRole,
  createProjectRole,
  updateProjectRole,
  replaceProjectUsersProjectRoleIdByNewRoleId,
  queryProjectRoleUsersCountByRoleId,
  deleteProjectRole,
  queryProjectRoleById,
  User,
  queryProjectRoles,
  QueryProjectRolesProps,
  UpdateProjectRoleProps,
  CreateProjectRoleProps,
  queryPermissions,
  QueryPermissionsProps,
  updatePermissions,
  Permission,
} from "@repo/database";
import constants from "@repo/constants";
import { PermissionsSchema } from "@repo/validation";

export class ProjectRolesService {
  async getProjectRole(id: ProjectRole["id"]): Promise<ProjectRole> {
    const projectRole = await queryProjectRoleById(id);

    if (!projectRole) {
      throw new NotFoundException("project role is not found");
    }

    return projectRole;
  }

  async createProjectRole(
    variables: CreateProjectRoleProps,
  ): Promise<ProjectRole> {
    try {
      const projectRole = await createProjectRole(variables);

      if (!projectRole) {
        throw new InternalServerErrorException();
      }

      return projectRole;
    } catch (error) {
      if (error instanceof DatabaseError) {
        if (
          error.constraint ===
          constants.database.project_role.projectUniqueRoleConstraint
        )
          throw new ConflictException("role names should be unique per");

        if (
          error.constraint ===
          constants.database.project_role.project_id.foreignKeyConstraint
        )
          throw new NotFoundException("project is not found");
      }

      throw error;
    }
  }

  async updateProjectRole(props: UpdateProjectRoleProps): Promise<ProjectRole> {
    try {
      const projectRole = await updateProjectRole(props);

      if (!projectRole) {
        throw new NotFoundException("project role is not found");
      }

      return projectRole;
    } catch (error) {
      if (
        error instanceof DatabaseError &&
        error.constraint ===
          constants.database.project_role.projectUniqueRoleConstraint
      ) {
        throw new ConflictException("role names should be unique");
      }

      throw error;
    }
  }

  async deleteProjectRole(
    projectRoleId: ProjectRole["id"],
    updatedBy: User["id"],
    fallbackRoleId?: ProjectRole["id"],
  ): Promise<ProjectRole> {
    const usersCount = await queryProjectRoleUsersCountByRoleId(projectRoleId);

    if (!usersCount) {
      const projectRole = await deleteProjectRole(projectRoleId);

      if (!projectRole) {
        throw new NotFoundException("project role is not found");
      }

      return projectRole;
    }

    if (!fallbackRoleId) {
      throw new BadRequestException("fallback role must be provided");
    }

    const role = await queryProjectRoleById(projectRoleId);

    if (!role) {
      throw new NotFoundException("project role is not found");
    }

    const fallbackRole = await queryProjectRoleById(fallbackRoleId);

    if (role.project_id !== fallbackRole?.project_id) {
      throw new BadRequestException("invalid fallback role provided");
    }

    const projectRole = await replaceProjectUsersProjectRoleIdByNewRoleId({
      projectRoleId,
      fallbackRoleId,
      updatedBy,
    });

    if (!projectRole) {
      throw new InternalServerErrorException();
    }

    return projectRole;
  }

  getProjectRoles(variables: QueryProjectRolesProps) {
    return queryProjectRoles(variables);
  }

  getProjectRolePermissions(props: QueryPermissionsProps) {
    return queryPermissions(props);
  }

  async updateProjectRolePermissions({
    permissionProjectRoleId,
    updatedBy,
    permissions,
  }: {
    permissionProjectRoleId: NonNullable<
      Permission["permission_project_role_id"]
    >;
    permissions: PermissionsSchema;
    updatedBy: Permission["created_by"];
  }) {
    return updatePermissions({
      create: permissions.map((permission) => ({
        ...permission,
        permission_project_role_id: permissionProjectRoleId,
      })),
      delete: {
        permissionProjectRoleId,
      },
      updatedBy,
    });
  }
}
