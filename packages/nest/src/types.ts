import { Request } from "express";

import {
  CreateProjectReturnType,
  CreateProjectUserEventProps,
  CreateProjectUserEventReturnType,
  DeleteProjectReturnType,
  DeleteUserByIdProps,
  DeleteUserByIdReturnType,
  InviteUserReturnType,
  Project,
  ProjectRole,
  ProjectUser,
  QueryEventWithParticipantsReturnType,
  QueryPermissionsReturnType,
  QueryProjectByIdProps,
  QueryProjectByIdReturnType,
  QueryProjectsCountGroupedByStatusReturnType,
  QueryProjectsCountReturnType,
  QueryProjectsPerTierStatisticReturnType,
  QueryProjectsProps,
  QueryProjectsReturnType,
  QueryProjectStatisticsProps,
  QueryProjectStatisticsReturnType,
  QueryProjectTierProps,
  QueryProjectTierReturnType,
  QueryProjectUserEventsProps,
  QueryProjectUserEventsReturnType,
  QueryProjectUsersCountProps,
  QueryProjectUsersCountReturnType,
  QueryProjectUsersProps,
  QueryProjectUsersReturnType,
  QueryTierByIdProps,
  QueryTierByIdReturnType,
  QueryTiersReturnType,
  QueryUserAllByIdProps,
  QueryUserAllByIdReturnType,
  QueryUserByEmailReturnType,
  QueryUsersProps,
  QueryUsersReturnType,
  QueryUserStatisticsProps,
  QueryUserStatisticsReturnType,
  UpdateProjectReturnType,
  UpdateProjectStatusReturnType,
  UpdateProjectUserProps,
  UpdateProjectUserReturnType,
  UpdateTierProps,
  UpdateTierReturnType,
  UpdateUserStatusReturnType,
  User,
  Event,
  UpdateEventProps,
  UpdateEventReturnType,
  DeleteEventReturnType,
  UpdateEventParticipantsReturnType,
} from "@repo/database";
import {
  CreateProjectSchema,
  InviteUserSchema,
  UpdateProjectSchema,
} from "@repo/validation";
import constants from "@repo/constants";

export type RequestWithParameters<
  T extends Record<string, any> = RequestWithUser,
> = {
  projectId?: Project["id"];
  projectRoleId?: ProjectRole["id"];
  userId?: User["id"];
  eventId?: Event["id"];
} & T;

export type RequestWithUser = Request & {
  user?: User;
};

export interface ProjectsServiceBase {
  getProjects(variables?: QueryProjectsProps): Promise<QueryProjectsReturnType>;

  createProject(
    props: CreateProjectSchema & {
      createdBy: Project["created_by"];
    },
  ): Promise<NonNullable<CreateProjectReturnType>["project"]>;

  getStatistics(): Promise<{
    total: number;
    project_statistics: QueryProjectsCountGroupedByStatusReturnType;
  }>;
}

export interface ProjectServiceBase {
  updateProject(
    props: UpdateProjectSchema & {
      projectId: Project["id"];
      updatedBy: Project["updated_by"];
      statuses?: Array<Project["status"]>;
    },
  ): Promise<UpdateProjectReturnType>;

  deleteProject(projectId: Project["id"]): Promise<DeleteProjectReturnType>;

  getProject(
    props: QueryProjectByIdProps,
  ): Promise<NonNullable<QueryProjectByIdReturnType>>;

  updateProjectStatus(props: {
    projectId: Project["id"];
    status: Exclude<Project["status"], "pending">;
    updatedBy: Project["id"];
  }): Promise<UpdateProjectStatusReturnType>;

  getProjectTier(projectId: Project["id"]): Promise<{
    tier: NonNullable<NonNullable<QueryProjectTierReturnType>["tier"]>;
    project_tier: NonNullable<QueryProjectTierReturnType>["project_tier"];
  }>;

  getProjectStatistics(projectId: QueryProjectStatisticsProps): Promise<{
    project: NonNullable<QueryProjectStatisticsReturnType>["project"];
    project_tier: NonNullable<
      NonNullable<QueryProjectStatisticsReturnType>["project_tier"]
    >;
    tier: NonNullable<NonNullable<QueryProjectStatisticsReturnType>["tier"]>;
    project_roles_count: NonNullable<QueryProjectStatisticsReturnType>["project_roles_count"];
    project_users: NonNullable<QueryProjectStatisticsReturnType>["project_users"];
  }>;
}

export interface ProjectUsersServiceBase {
  getProjectUsers(
    props: QueryProjectUsersProps,
  ): Promise<QueryProjectUsersReturnType>;

  getProjectUsersCount(
    props: QueryProjectUsersCountProps,
  ): Promise<QueryProjectUsersCountReturnType>;
}

export interface ProjectUserServiceBase {
  getProjectsUser(
    props: QueryProjectUsersProps,
  ): Promise<QueryProjectUsersReturnType[number] | undefined>;

  deleteProjectUser(
    props: Omit<UpdateProjectUserProps, "fields">,
  ): Promise<NonNullable<UpdateProjectUserReturnType>>;

  updateProjectUser(
    props: UpdateProjectUserProps,
  ): Promise<NonNullable<UpdateProjectUserReturnType>>;
}

export interface ProjectsUserServiceBase {
  getProjectUsers(
    props: Omit<QueryProjectUsersProps, "projectId">,
  ): Promise<QueryProjectUsersReturnType>;

  getProjectUsersCount(props: {
    projectRoleId?: ProjectUser["project_role_id"];
    userId: ProjectUser["user_id"];
  }): Promise<QueryProjectUsersCountReturnType>;
}

export interface UsersServiceBase {
  getUsersStatistic(): Promise<
    Record<(typeof constants.database.user.user_role)[number], number> & {
      total: number;
    }
  >;

  getUsers(props?: QueryUsersProps): Promise<QueryUsersReturnType>;

  inviteCreatorUser(
    props: InviteUserSchema & {
      invitedBy: User["id"];
    },
  ): Promise<NonNullable<InviteUserReturnType["user"]>>;

  inviteGeneralUser(props: {
    email: User["email"];
    project_id: ProjectUser["project_id"];
    project_role_id: ProjectUser["project_role_id"];
    inviterId: User["id"];
  }): Promise<NonNullable<QueryUserByEmailReturnType>>;
}

export interface UserServiceBase {
  getUser(
    userId: QueryUserAllByIdProps,
  ): Promise<NonNullable<QueryUserAllByIdReturnType>>;

  deleteUser(userId: DeleteUserByIdProps): Promise<DeleteUserByIdReturnType>;

  getUserStatistics(
    props: QueryUserStatisticsProps,
  ): Promise<QueryUserStatisticsReturnType>;

  updateUserStatus(
    userId: User["id"],
    status: User["status"],
    updatedBy: User["id"],
  ): Promise<NonNullable<UpdateUserStatusReturnType>>;
}

export interface UserProjectsServiceBase {
  getProjects(props: {
    ownerId: Project["owner_id"];
    statuses?: Array<Project["status"]>;
  }): Promise<QueryProjectsReturnType>;
  getProjectsCount(
    ownerId: Project["owner_id"],
  ): Promise<QueryProjectsCountReturnType>;
}

export interface UserProjectServiceBase {
  getUserProject(props: {
    ownerId: Project["owner_id"];
    projectId: Project["id"];
    statuses?: Array<Project["status"]>;
  }): Promise<QueryProjectsReturnType[number]>;
}

export interface TiersServiceBase {
  getStatistics(): Promise<QueryProjectsPerTierStatisticReturnType>;

  getAll(): Promise<QueryTiersReturnType>;
}

export interface TierServiceBase {
  getTier(
    props: QueryTierByIdProps,
  ): Promise<NonNullable<QueryTierByIdReturnType>>;

  updateTier(
    props: UpdateTierProps,
  ): Promise<NonNullable<UpdateTierReturnType>>;
}

export interface ProjectTierServiceBase {
  getProjectTier(props: QueryProjectTierProps): Promise<{
    tier: NonNullable<NonNullable<QueryProjectTierReturnType>["tier"]>;
    project_tier: NonNullable<QueryProjectTierReturnType>["project_tier"];
  }>;
}

export interface ProjectPermissionsServiceBase {
  getProjectPermissions(
    projectId: Project["id"],
  ): Promise<QueryPermissionsReturnType>;
}

export interface ProjectUserEventsServiceBase {
  getProjectUserEvents(
    props: QueryProjectUserEventsProps,
  ): Promise<QueryProjectUserEventsReturnType>;

  createProjectUserEvent(
    props: CreateProjectUserEventProps & {
      projectId: ProjectUser["project_id"];
    },
  ): Promise<CreateProjectUserEventReturnType>;
}
export interface ProjectRolePermissionsUsersServiceBase {
  getUsersByPermission(
    projectId: Project["id"],
    projectRoleId: ProjectRole["id"],
  ): Promise<QueryProjectUsersReturnType>;
}
export interface ProjectUserEventServiceBase {
  getProjectUserEvent(
    eventId: Event["id"],
  ): Promise<QueryEventWithParticipantsReturnType>;

  updateProjectUserEvent(
    props: UpdateEventProps,
  ): Promise<UpdateEventReturnType>;

  deleteProjectUserEvent(eventId: Event["id"]): Promise<DeleteEventReturnType>;
}

export interface ProjectUserEventParticipantsServiceBase {
  updateProjectUserEventParticipants(props: {
    eventId: Event["id"];
    projectId: Project["id"];
    updatedBy: User["id"];
    participants: ProjectUser["id"][];
  }): Promise<UpdateEventParticipantsReturnType>;
}
