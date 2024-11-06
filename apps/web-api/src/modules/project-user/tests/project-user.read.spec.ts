import { HttpStatus, INestApplication } from "@nestjs/common";
import request from "supertest";

import { User } from "@repo/database";
import constants from "@repo/constants";

import { testBeforeAll } from "@tests/helpers/before-all";
import {
  testCreateProject,
  testCreateProjectRole,
  testCreateProjectUser,
  testCreateUser,
  testCreateUserInfo,
  testProjectId,
  testUserId,
} from "@tests/helpers/factories";
import { testRunMigrations } from "@tests/helpers/run-migrations";
import { testMigrations } from "@tests/migrations";
import { testCreateSession } from "@tests/helpers/create-session";
import { testSuccessResponse } from "@tests/helpers/success-response";
import { testAfterAll } from "@tests/helpers/after-all";

describe("project user read", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await testBeforeAll();
  });

  beforeEach(async () => {
    await testRunMigrations([
      testMigrations.clearAll,
      testMigrations.userAdmin0,
      testMigrations.userCreator0,
      testMigrations.project0UserCreator0Ready,
      testMigrations.userGeneral0,
      testMigrations.project0Role0,
      testMigrations.project0UserGeneral0Role0,
    ]);
  });

  const projectCreatorId = testUserId("creator", 0);
  const projectUserId = testUserId("general", 0);
  const projectId = testProjectId(0);

  const project = testCreateProject({
    projectIndex: 0,
    userRole: "creator",
    userIndex: 0,
    projectStatus: "ready",
  });

  const userInfo = testCreateUserInfo({ role: "general", index: 0 });

  const successProjectUserResponse = testSuccessResponse({
    project_user: testCreateProjectUser({
      projectIndex: 0,
      userIndex: 0,
      userRole: "general",
      projectRoleIndex: 0,
    }),
    project_role: testCreateProjectRole({ projectIndex: 0, roleIndex: 0 }),
    user: testCreateUser({ index: 0, role: "general" }),
    user_info: {
      email_verified: userInfo.email_verified,
      email_verified_at: userInfo.email_verified_at,
    },
    project: {
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,
    },
  });

  const getProjectsUser = async (
    sessionUserId: User["id"] = "",
    userId: User["id"] = projectUserId,
  ) => {
    return request(app.getHttpServer())
      .get(`/projects/${projectId}/users/${userId}`)
      .set({
        cookie:
          sessionUserId &&
          `${constants.cookies.session}=${await testCreateSession(sessionUserId)}`,
      });
  };

  it("by project owner should work", async () => {
    const response = await getProjectsUser(projectCreatorId);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual(successProjectUserResponse);
  });

  it("by yourself should work", async () => {
    const response = await getProjectsUser(projectUserId);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual(successProjectUserResponse);
  });

  describe("by project user who has role:read permission", () => {
    it("for all project should work", async () => {
      await testRunMigrations([
        testMigrations.userGeneral1,
        testMigrations.project0Role1,
        testMigrations.project0UserGeneral1Role1,
        testMigrations.project0Role1PermissionRoleReadAll,
      ]);

      const response = await getProjectsUser(
        testUserId("general", 1),
        testUserId("general", 0),
      );

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual(successProjectUserResponse);
    });

    it("for this role should work", async () => {
      await testRunMigrations([
        testMigrations.userGeneral1,
        testMigrations.project0Role1,
        testMigrations.project0UserGeneral1Role1,
        testMigrations.project0Role1PermissionRoleReadRole0,
      ]);

      const response = await getProjectsUser(
        testUserId("general", 1),
        testUserId("general", 0),
      );

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual(successProjectUserResponse);
    });

    it("not for this role should not work", async () => {
      await testRunMigrations([
        testMigrations.userGeneral1,
        testMigrations.project0Role1,
        testMigrations.project0UserGeneral1Role1,
        testMigrations.project0Role1PermissionRoleReadRole1,
      ]);

      const response = await getProjectsUser(
        testUserId("general", 1),
        testUserId("general", 0),
      );

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });
  });

  it("by other creator should not work", async () => {
    await testRunMigrations([testMigrations.userCreator1]);

    const response = await getProjectsUser(testUserId("creator", 1));

    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });

  it("by other general should not work", async () => {
    await testRunMigrations([testMigrations.userGeneral1]);

    const response = await getProjectsUser(testUserId("general", 1));

    expect(response.statusCode).toBe(HttpStatus.FORBIDDEN);
  });

  it("by admin should not work", async () => {
    const response = await getProjectsUser(testUserId("creator", 1));

    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });

  it("by anonymous should not work", async () => {
    const response = await getProjectsUser();

    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });

  it("should return 404 when user status is 'deleted'", async () => {
    await testRunMigrations([
      testMigrations.userGeneral1,
      testMigrations.project0UserGeneral1DeletedRole0,
    ]);

    const response = await getProjectsUser(
      projectCreatorId,
      testUserId("general", 1),
    );

    expect(response.status).toBe(HttpStatus.NOT_FOUND);
  });

  it("should return 404 when user reading own profile and his status is not 'ready'", async () => {
    await testRunMigrations([
      testMigrations.userGeneral1,
      testMigrations.project0UserGeneral1BlockedRole0,
    ]);

    const usedId = testUserId("general", 1);
    const response = await getProjectsUser(usedId, usedId);

    expect(response.status).toBe(HttpStatus.NOT_FOUND);
  });

  afterAll(() => testAfterAll(app));
});
