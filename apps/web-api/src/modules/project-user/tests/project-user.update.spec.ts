import { HttpStatus, INestApplication } from "@nestjs/common";
import request from "supertest";

import { ProjectUser, User, updateProjectStatus } from "@repo/database";
import constants from "@repo/constants";

import { testBeforeAll } from "@tests/helpers/before-all";
import {
  testCreateProjectUser,
  testProjectId,
  testProjectRoleId,
  testUserId,
} from "@tests/helpers/factories";
import { testRunMigrations } from "@tests/helpers/run-migrations";
import { testMigrations } from "@tests/migrations";
import { testCreateSession } from "@tests/helpers/create-session";
import { testSuccessResponse } from "@tests/helpers/success-response";
import { testAfterAll } from "@tests/helpers/after-all";

describe("project user update", () => {
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

  describe("role", () => {
    const newRoleId = testProjectRoleId(0, 1);

    const { updated_at: _, ...projectUser } = testCreateProjectUser({
      userIndex: 0,
      userRole: "general",
      projectIndex: 0,
      projectRoleIndex: 1,
    });

    const successUpdateResponse = testSuccessResponse(projectUser);

    const body = {
      project_role_id: newRoleId,
    };

    const updateProjectUser = async (
      sessionUserId: User["id"] = "",
      updateBody = body,
      userId?: User["id"],
    ) => {
      return request(app.getHttpServer())
        .patch(`/projects/${projectId}/users/${userId ?? projectUserId}`)
        .send(updateBody)
        .set({
          cookie:
            sessionUserId &&
            `${constants.cookies.session}=${await testCreateSession(sessionUserId)}`,
        });
    };

    beforeEach(async () => {
      await testRunMigrations([testMigrations.project0Role1]);
    });

    it("by project owner should work", async () => {
      const response = await updateProjectUser(projectCreatorId);
      const { updated_at, ...data } = response.body.data;

      expect(response.status).toBe(HttpStatus.OK);
      expect(testSuccessResponse(data)).toEqual(successUpdateResponse);

      expect(new Date(updated_at).valueOf()).toBeGreaterThan(
        new Date(projectUser.created_at).valueOf(),
      );
    });

    it("with invalid body should not work", async () => {
      const [response0, response1] = await Promise.all([
        updateProjectUser(projectCreatorId, {} as typeof body),
        updateProjectUser(projectCreatorId, { project_role_id: "" }),
      ]);

      expect(response0.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(response1.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it("by other creator should not work", async () => {
      await testRunMigrations([testMigrations.userCreator1]);

      const response = await updateProjectUser(testUserId("creator", 1));

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    it("by other general should not work", async () => {
      await testRunMigrations([testMigrations.userGeneral1]);

      const response = await updateProjectUser(testUserId("general", 1));

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    it("by admin should not work", async () => {
      const response = await updateProjectUser(testUserId("admin", 0));

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    it("by anonymous should not work", async () => {
      const response = await updateProjectUser();

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    it("should not work when user does not exist", async () => {
      const response = await updateProjectUser(
        projectCreatorId,
        body,
        testUserId("general", 5),
      );

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });
  });

  describe("status", () => {
    const body = {
      status: "blocked",
    };

    const { updated_at: _, ...projectUser } = testCreateProjectUser({
      userIndex: 0,
      userRole: "general",
      projectIndex: 0,
      projectRoleIndex: 0,
      status: body.status as ProjectUser["status"],
    });

    const updateStatusSuccessResponse = testSuccessResponse(projectUser);

    const updateProjectUserStatus = async (
      sessionUserId: User["id"] = "",
      updateBody = body,
      userId?: User["id"],
    ) => {
      return request(app.getHttpServer())
        .patch(`/projects/${projectId}/users/${userId ?? projectUserId}/status`)
        .send(updateBody)
        .set({
          cookie:
            sessionUserId &&
            `${constants.cookies.session}=${await testCreateSession(sessionUserId)}`,
        });
    };

    it("by project owner should work", async () => {
      const response = await updateProjectUserStatus(projectCreatorId);
      const { updated_at, ...data } = response.body.data;

      expect(response.status).toBe(HttpStatus.OK);
      expect(testSuccessResponse(data)).toEqual(updateStatusSuccessResponse);

      expect(new Date(updated_at).valueOf()).toBeGreaterThan(
        new Date(projectUser.created_at).valueOf(),
      );
    });

    it("by project owner should not work when project status is not 'ready'", async () => {
      await updateProjectStatus({
        id: projectId,
        updatedBy: testUserId("admin", 0),
        status: "pending",
      });

      const response = await updateProjectUserStatus(projectCreatorId);

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    it("with invalid body should not work", async () => {
      const [response0, response1] = await Promise.all([
        updateProjectUserStatus(projectCreatorId, {} as typeof body),
        updateProjectUserStatus(projectCreatorId, { status: "" }),
      ]);

      expect(response0.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(response1.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it("by other creator should not work", async () => {
      await testRunMigrations([testMigrations.userCreator1]);

      const response = await updateProjectUserStatus(testUserId("creator", 1));

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    it("by other general should not work", async () => {
      await testRunMigrations([testMigrations.userGeneral1]);

      const response = await updateProjectUserStatus(testUserId("general", 1));

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    it("by admin should not work", async () => {
      const response = await updateProjectUserStatus(testUserId("admin", 0));

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    it("by anonymous should not work", async () => {
      const response = await updateProjectUserStatus();

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    it("when user does not exist should not work", async () => {
      const response = await updateProjectUserStatus(
        projectCreatorId,
        body,
        testUserId("general", 5),
      );

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });
  });

  afterAll(() => testAfterAll(app));
});
