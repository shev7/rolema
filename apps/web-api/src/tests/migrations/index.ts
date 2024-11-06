import { testTruncateAll } from "./clean-up";
import { testCreateTierMigration } from "./create-tier-migration";
import { testCreateProjectMigration } from "./create-project-migration";
import { testCreateProjectRoleMigration } from "./create-project-role-migration";
import { testCreateUserMigration } from "./create-user-migration";
import { testCreateProjectUserMigration } from "./create-project-user-migartion";
import { project0ToStatus } from "./project0-to-status";
import { testCreatePermissionMigration } from "./create-permission-migartion";
import { testCreateDeleteProjectUserMigration } from "./create-delete-project-user-migration";
import { testCreateEventMigration } from "./create-event-migration";
import { testCreateEventParticipantMigration } from "./create-event-participant-migration";
import { testProjectUserId } from "@tests/helpers/factories";

const userAdmin0 = testCreateUserMigration({ role: "admin", index: 0 });
const userCreator0 = testCreateUserMigration({ role: "creator", index: 0 });
const userCreator1 = testCreateUserMigration({ role: "creator", index: 1 });
const userGeneral0 = testCreateUserMigration({ role: "general", index: 0 });
const userGeneral1 = testCreateUserMigration({ role: "general", index: 1 });
const userGeneral2 = testCreateUserMigration({ role: "general", index: 2 });

const userGeneral1Ready = testCreateUserMigration({
  role: "general",
  index: 1,
  status: "ready",
});

const userGeneral1Deleted = testCreateUserMigration({
  role: "general",
  index: 1,
  status: "deleted",
});
const userGeneral1Blocked = testCreateUserMigration({
  role: "general",
  index: 1,
  status: "blocked",
});
const userGeneral1Pending = testCreateUserMigration({
  role: "general",
  index: 1,
  status: "pending",
});

const tier0 = testCreateTierMigration(0);

const project0Role0 = testCreateProjectRoleMigration({
  projectIndex: 0,
  roleIndex: 0,
});

const project0Role1 = testCreateProjectRoleMigration({
  projectIndex: 0,
  roleIndex: 1,
});

const project0UserCreator0Deleted = testCreateProjectMigration({
  projectIndex: 0,
  userRole: "creator",
  userIndex: 0,
  projectStatus: "deleted",
});

const project0UserCreator0Paused = testCreateProjectMigration({
  projectIndex: 0,
  userRole: "creator",
  userIndex: 0,
  projectStatus: "paused",
});

const project0UserCreator0Pending = testCreateProjectMigration({
  projectIndex: 0,
  userRole: "creator",
  userIndex: 0,
  projectStatus: "pending",
});

const project0UserCreator0Ready = testCreateProjectMigration({
  projectIndex: 0,
  userRole: "creator",
  userIndex: 0,
  projectStatus: "ready",
});

const project0UserGeneral0Role0 = testCreateProjectUserMigration({
  projectIndex: 0,
  projectRoleIndex: 0,
  userIndex: 0,
  userRole: "general",
});

const project0UserGeneral1Role0 = testCreateProjectUserMigration({
  projectIndex: 0,
  projectRoleIndex: 0,
  userIndex: 1,
  userRole: "general",
});

const project0UserGeneral2Role0 = testCreateProjectUserMigration({
  projectIndex: 0,
  projectRoleIndex: 0,
  userIndex: 2,
  userRole: "general",
});

const project0UserGeneral1Role1 = testCreateProjectUserMigration({
  projectIndex: 0,
  projectRoleIndex: 1,
  userIndex: 1,
  userRole: "general",
});

const project0UserGeneral1DeletedRole0 = testCreateProjectUserMigration({
  projectIndex: 0,
  projectRoleIndex: 0,
  userIndex: 1,
  userRole: "general",
  status: "deleted",
});

const project0UserGeneral1BlockedRole0 = testCreateProjectUserMigration({
  projectIndex: 0,
  projectRoleIndex: 0,
  userIndex: 1,
  userRole: "general",
  status: "blocked",
});

const project0ToReady = project0ToStatus("ready");
const project0ToPaused = project0ToStatus("paused");
const project0ToPending = project0ToStatus("pending");
const project0ToDeleted = project0ToStatus("deleted");
const project0Role1PermissionRoleReadAll = testCreatePermissionMigration({
  permissionIndex: 0,
  key: "role:read",
  projectIndex: 0,
  roleIndex: 1,
  projectIdIndex: 0,
});

const project0Role1PermissionRoleReadRole0 = testCreatePermissionMigration({
  permissionIndex: 0,
  key: "role:read",
  projectIndex: 0,
  roleIndex: 1,
  projectRoleIdIndex: 0,
});

const project0Role1PermissionRoleReadRole1 = testCreatePermissionMigration({
  permissionIndex: 0,
  key: "role:read",
  projectIndex: 0,
  roleIndex: 1,
  projectRoleIdIndex: 1,
});

const deleteProject0User0 = testCreateDeleteProjectUserMigration(0, 0);

const event0 = testCreateEventMigration({ eventIndex: 0 });

const event0Participant0Proj0User0 = testCreateEventParticipantMigration({
  eventIndex: 0,
  projectUserId: testProjectUserId(0, 0),
});

const event0Participant0Proj0User1 = testCreateEventParticipantMigration({
  eventIndex: 0,
  projectUserId: testProjectUserId(0, 1),
});

const event0Participant0Proj0User2 = testCreateEventParticipantMigration({
  eventIndex: 0,
  projectUserId: testProjectUserId(0, 2),
});

export const testMigrations = {
  clearAll: testTruncateAll,
  project0Role0,
  project0Role1,
  project0Role1PermissionRoleReadAll,
  project0Role1PermissionRoleReadRole0,
  project0Role1PermissionRoleReadRole1,
  project0UserCreator0Deleted,
  project0UserCreator0Paused,
  project0UserCreator0Pending,
  project0UserCreator0Ready,
  project0UserGeneral0Role0,
  project0UserGeneral1BlockedRole0,
  project0ToReady,
  project0ToPaused,
  project0ToPending,
  project0ToDeleted,
  userGeneral1Blocked,
  userGeneral1Deleted,
  userGeneral1Pending,
  userGeneral1Ready,
  project0UserGeneral1DeletedRole0,
  project0UserGeneral1Role1,
  tier0,
  userAdmin0,
  userCreator0,
  userCreator1,
  userGeneral0,
  userGeneral1,
  userGeneral2,
  project0UserGeneral1Role0,
  deleteProject0User0,
  event0,
  event0Participant0Proj0User0,
  event0Participant0Proj0User1,
  event0Participant0Proj0User2,
  project0UserGeneral2Role0,
} as const;
