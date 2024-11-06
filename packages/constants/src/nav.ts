const routes = {
  accessDenied: "/access-denied",
  account: () => `/account`,
  createProject: "/create-project",
  dashboard: "/dashboard",
  home: "/",
  login: "/login",
  project: (projectId: string, status?: string) =>
    `${routes.projects}/${projectId}${status ? `/${status}` : ""}`,
  projectInfo: (projectId: string) => `${routes.project(projectId)}/info`,
  projectRole: (projectRoleId: string, projectId?: string) =>
    `${routes.projectRoles(projectId)}/${projectRoleId}`,
  projectRoleInfo: (projectRoleId: string, projectId?: string) =>
    `${routes.projectRole(projectRoleId, projectId)}/info`,
  projectRoleUsers: (projectRoleId: string, projectId?: string) =>
    `${routes.projectRole(projectRoleId, projectId)}/users`,
  projectRolePermissions: (projectRoleId: string, projectId?: string) =>
    `${routes.projectRole(projectRoleId, projectId)}/permissions`,
  projectRoleSettings: (projectRoleId: string, projectId?: string) =>
    `${routes.projectRole(projectRoleId, projectId)}/settings`,
  projectTier: (projectId: string) =>
    `${routes.projectSettings(projectId, false)}/tier`,
  projectRoles: (projectId?: string) =>
    `${projectId ? routes.project(projectId) : "/projects"}/roles`,
  projectCalendar: (projectId?: string) =>
    `${projectId ? routes.project(projectId) : "/projects"}/calendar`,
  projects: "/projects",
  projectUsers: (projectId: string) => `${routes.project(projectId)}/users`,
  register: "/register",
  projectSettings: (projectId: string, isGeneral = true) =>
    `${routes.project(projectId)}/settings${isGeneral ? "/general" : ""}`,
  tier: (tierId: string) => `${routes.tiers()}/${tierId}`,
  tierInfo: (tierId: string) => `${routes.tiers()}/${tierId}/info`,
  tiers: () => `/tiers`,
  user: (userId: string, projectId?: string) =>
    `${projectId ? `${routes.projects}/${projectId}` : ""}${routes.users()}/${userId}`,
  userError: (userId: string) => `${routes.user(userId)}/error`,
  userInfo: (userId: string, projectId?: string) =>
    `${projectId ? routes.project(projectId) : ""}${routes.user(userId)}/info`,
  userProjects: (userId: string) => `${routes.user(userId)}/projects`,
  userProjectUsers: (userId: string) => `${routes.user(userId)}/project-users`,
  userSettings: (userId: string, projectId?: string) =>
    `${projectId ? routes.project(projectId) : ""}${routes.user(userId)}/settings`,
  users: ({
    projectId,
  }: {
    projectId?: string;
  } = {}) => `${projectId ? `${routes.projects}/${projectId}` : ""}/users`,

  projectUser: (projectId: string, userId: string) =>
    `${routes.project(projectId)}/users/${userId}`,
  projectUserSettings: (projectId: string, userId: string) =>
    `${routes.projectUser(projectId, userId)}/settings`,
};

export default {
  routes,
  sp: {
    keys: {
      excludeProjectRoleId: "exclude_project_role_id",
      excludeUserRole: "exclude_user_role",
      fallbackRoleId: "fallback_role_id",
      projectId: "project_id",
      projectRoleId: "project_role_id",
      tab: "tab",
      url: "url",
      userId: "user_id",
      userRole: "user_role",
      usersSort: "usort",
      tierId: "tier_id",
      date: "date",
      newEvent: "new_event",
      startDate: "start_date",
      endDate: "end_date",
      eventId: "event_id",
    },
    values: {
      info: "info",
      projects: "projects",
      projectUser: "project_user",
      users: "users",
    },
    sort: {
      userRoleAsc: "ur:asc",
      userRoleDesc: "ur:desc",
    },
    limit: {
      name: "limit",
      min: 1,
      max: 100,
      projectUsers: 10,
    },
  },
} as const;
