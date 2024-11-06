import {
  Event,
  EventParticipant,
  Permission,
  Project,
  ProjectRole,
  ProjectUser,
  Tier,
  User,
  UserInfo,
} from "@repo/database";

import {
  TEST_DATE,
  TEST_ROLE_SHORTHANDS,
  TEST_PASSWORD,
} from "@tests/constants";

export type CreateUserProps = {
  role: User["role"];
  status?: User["status"];
  index: number;
};

export type CreateProjectRoleProps = {
  projectIndex: number;
  roleIndex: number;
  createdBy?: User["id"];
  updatedBy?: User["id"];
};

export type CreateProjectProps = {
  userIndex: number;
  projectIndex: number;
  userRole: User["role"];
  projectStatus: Project["status"];
  updatedBy?: User["id"];
};

export type CreateProjectUserProps = {
  projectIndex: number;
  userIndex: number;
  userRole: User["role"];
  status?: ProjectUser["status"];
  projectRoleIndex: number;
  updatedBy?: User["id"];
};

type CreateProjectPermissionReturnType = {
  created_at: string;
  updated_at: string;
} & Omit<Permission, "created_at" | "updated_at">;

export type TestCreatePermissionProps = {
  projectIndex: number;
  roleIndex: number;
  key: Permission["key"];
  permissionIndex?: number;
  projectRoleIdIndex?: number;
  projectIdIndex?: number;
  updatedBy?: User["id"];
};

type CreateProjectRoleReturnType = ProjectRole;

export type TestCreateEventProps = {
  eventIndex: number;
  createdBy?: Event["created_by"];
  startDate?: Event["start_date"];
  endDate?: Event["end_date"];
  cron?: Event["cron"];
};

export type TestCreateEventParticipantProps = {
  eventIndex: number;
  createdBy?: Event["created_by"];
  projectUserId?: ProjectUser["id"];
};

export const testUserEmail = (role: User["role"], index: number) => {
  return `u${TEST_ROLE_SHORTHANDS[role]}${index}@rolema.com`;
};

export const testUserId = (role: User["role"], index: number) => {
  return `u_${TEST_ROLE_SHORTHANDS[role]}_${index}`;
};

export const testTierId = (index: number) => {
  return `t${index}`;
};

export const testTierName = (index: number) => {
  return `tier ${index} name`;
};

export const testTierDescription = (index: number) => {
  return `tier ${index} description`;
};

export const testProjectId = (index: number) => {
  return `prj${index}`;
};

export const testProjectName = (index: number) => {
  return `project ${index} name`;
};

export const testProjectDescription = (index: number) => {
  return `project ${index} description`;
};

export const testPermissionId = (index: number) => {
  return `perm_${index}`;
};

export const testProjectRoleId = (projectIndex: number, roleIndex: number) => {
  return `${testProjectId(projectIndex)}rol${roleIndex}`;
};

export const testProjectPermissionId = (
  index: number,
  projectIndex: number,
) => {
  return `perm${index}proj${projectIndex}`;
};

export const testRolePermissionId = (index: number, projectIndex: number) => {
  return `perm${index}role${projectIndex}`;
};

export const testProjectRoleName = (
  projectIndex: number,
  roleIndex: number,
) => {
  return `project ${projectIndex} role ${roleIndex}`;
};

export const testProjectUserId = (projectIndex: number, userIndex: number) => {
  return `pj${projectIndex}user${userIndex}`;
};

export const testEventId = (eventIndex: number) => {
  return `eventidenti${eventIndex}`;
};

export const testEventTitle = (eventIndex: number) => {
  return `event ${eventIndex}`;
};

export const testEventParticipantId = (
  eventIndex: number,
  projectUserId: ProjectUser["id"],
) => {
  return `ev${eventIndex}part${projectUserId}`;
};

export const testCreateUser = ({
  role,
  index,
  status = "ready",
}: CreateUserProps): User => {
  return {
    id: testUserId(role, index),
    email: testUserEmail(role, index),
    role,
    status,
    updated_by: testUserId("admin", 0),
    created_at: TEST_DATE,
    updated_at: TEST_DATE,
  };
};

export const testCreateUserInfo = ({
  role,
  index,
}: CreateUserProps): UserInfo => {
  const adminId = testUserId("admin", 0);

  return {
    user_id: testUserId(role, index),
    email_verified: true,
    email_verified_at: TEST_DATE,
    invited_by: adminId,
    updated_by: adminId,
    updated_at: TEST_DATE,
    password_hash: TEST_PASSWORD,
  };
};

export const testCreateTier = (index: number): Tier => {
  const adminId = testUserId("admin", 0);

  return {
    id: testTierId(index),
    name: testTierName(index),
    description: testTierDescription(index),
    benefits: [],
    created_by: adminId,
    updated_by: adminId,
    created_at: TEST_DATE,
    updated_at: TEST_DATE,
    price_per_month_monthly: [],
    price_per_month_annually: [],
    projects_count: 1,
    users_per_project_count: 10,
    roles_per_project_count: 3,
  };
};

export const testCreateProjectRole = ({
  projectIndex,
  roleIndex,
  createdBy,
  updatedBy,
}: CreateProjectRoleProps): CreateProjectRoleReturnType => {
  const creatorId = testUserId("creator", 0);

  return {
    id: testProjectRoleId(projectIndex, roleIndex),
    project_id: testProjectId(projectIndex),
    name: testProjectRoleName(projectIndex, roleIndex),
    created_by: createdBy ?? creatorId,
    updated_by: updatedBy ?? creatorId,
    created_at: TEST_DATE,
    updated_at: TEST_DATE,
  };
};

export const testCreateProject = ({
  projectIndex,
  userRole,
  userIndex,
  projectStatus,
  updatedBy,
}: CreateProjectProps): Project => {
  const adminId = testUserId("admin", 0);

  return {
    id: testProjectId(projectIndex),
    name: testProjectName(projectIndex),
    description: testProjectDescription(projectIndex),
    owner_id: testUserId(userRole, userIndex),
    created_by: adminId,
    updated_by: updatedBy ?? adminId,
    created_at: TEST_DATE,
    updated_at: TEST_DATE,
    status: projectStatus,
  };
};

export const testCreateProjectUser = ({
  userIndex,
  userRole,
  projectIndex,
  projectRoleIndex,
  status = "ready",
  updatedBy,
}: CreateProjectUserProps): ProjectUser => {
  return {
    id: testProjectUserId(projectIndex, userIndex),
    user_id: testUserId(userRole, userIndex),
    project_id: testProjectId(projectIndex),
    project_role_id: testProjectRoleId(projectIndex, projectRoleIndex),
    updated_by: updatedBy ?? testUserId("creator", 0),
    created_at: TEST_DATE,
    updated_at: TEST_DATE,
    status,
  };
};

export const testCreateProjectPermission = (
  index: number,
  projectIndex: number,
  key: Permission["key"] = "role:read",
): CreateProjectPermissionReturnType => {
  const creatorId = testUserId("creator", 0);

  return {
    id: testProjectPermissionId(index, projectIndex),
    project_id: testProjectId(projectIndex),
    key,
    created_at: TEST_DATE.toString(),
    updated_at: TEST_DATE.toString(),
    created_by: creatorId,
    updated_by: creatorId,
    permission_project_role_id: null,
    project_role_id: null,
  };
};
export const testCreatePermission = ({
  permissionIndex = 0,
  key,
  projectIndex,
  roleIndex,
  projectIdIndex,
  projectRoleIdIndex,
  updatedBy = testUserId("creator", 0),
}: TestCreatePermissionProps): Permission => {
  return {
    id: testPermissionId(permissionIndex),
    key,
    permission_project_role_id: testProjectRoleId(projectIndex, roleIndex),
    project_id:
      typeof projectIdIndex === "number" ? testProjectId(projectIdIndex) : null,
    project_role_id:
      typeof projectRoleIdIndex === "number"
        ? testProjectRoleId(projectIndex, projectRoleIdIndex)
        : null,
    created_by: updatedBy,
    updated_by: updatedBy,
    created_at: TEST_DATE,
    updated_at: TEST_DATE,
  };
};

export const testCreateEvent = ({
  eventIndex,
  createdBy = testUserId("general", 0),
  startDate = new Date("2020-08-18"),
  endDate = new Date("2020-08-19"),
  cron = null,
}: TestCreateEventProps): Event => {
  return {
    id: testEventId(eventIndex),
    created_at: TEST_DATE,
    updated_at: TEST_DATE,
    title: testEventTitle(eventIndex),
    created_by: createdBy,
    updated_by: createdBy,
    start_date: startDate,
    end_date: endDate,
    cron,
  };
};

export const testCreateEventParticipant = ({
  eventIndex,
  createdBy = testUserId("general", 0),
  projectUserId = testProjectUserId(0, 0),
}: TestCreateEventParticipantProps): EventParticipant => {
  return {
    id: testEventParticipantId(eventIndex, projectUserId),
    event_id: testEventId(eventIndex),
    created_at: TEST_DATE,
    updated_at: TEST_DATE,
    created_by: createdBy,
    updated_by: createdBy,
    project_user_id: projectUserId,
  };
};
