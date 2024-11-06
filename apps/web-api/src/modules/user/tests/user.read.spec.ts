import { HttpStatus, INestApplication } from "@nestjs/common";
import request from "supertest";

import { User } from "@repo/database";
import constants from "@repo/constants";

import { testAfterAll } from "@tests/helpers/after-all";
import { testBeforeAll } from "@tests/helpers/before-all";
import { testRunMigrations } from "@tests/helpers/run-migrations";
import { testMigrations } from "@tests/migrations";
import {
  testCreateUser,
  testProjectRoleId,
  testUserId,
} from "@tests/helpers/factories";
import { testCreateSession } from "@tests/helpers/create-session";
import { testSuccessResponse } from "@tests/helpers/success-response";

describe("user read", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await testBeforeAll();
  });

  beforeEach(async () => {
    await testRunMigrations([
      testMigrations.clearAll,
      testMigrations.userAdmin0,
      testMigrations.userCreator0,
      testMigrations.userCreator1,
      testMigrations.userGeneral1,
      testMigrations.project0UserCreator0Ready,
      testMigrations.userGeneral0,
      testMigrations.project0Role0,
      testMigrations.project0UserGeneral0Role0,
    ]);
  });

  const creatorId = testUserId("creator", 0);
  const generalId = testUserId("general", 0);
  const otherGeneral = testUserId("general", 1);
  const adminId = testUserId("admin", 0);
  const otherCreatorId = testUserId("creator", 1);

  const getUser = async (
    sessionUserId: User["id"] = creatorId,
    userId: User["id"] = generalId,
  ) => {
    return request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set({
        cookie:
          sessionUserId &&
          `${constants.cookies.session}=${await testCreateSession(sessionUserId)}`,
      });
  };

  const getUserStatistic = async (
    sessionUserId: User["id"] = creatorId,
    userId: User["id"] = generalId,
  ) => {
    return request(app.getHttpServer())
      .get(`/users/${userId}/statistics`)
      .set({
        cookie:
          sessionUserId &&
          `${constants.cookies.session}=${await testCreateSession(sessionUserId)}`,
      });
  };

  describe("profile info", () => {
    it.each([["user himself", generalId]])(
      "by %s should work",
      async (_, userId) => {
        const response = await getUser(userId);

        const testGeneral = testCreateUser({
          role: "general",
          index: 0,
        });

        expect(response.status).toBe(HttpStatus.OK);

        expect(response.body).toEqual(
          testSuccessResponse({
            id: testGeneral.id,
            email: testGeneral.email,
            role: testGeneral.role,
            created_at: testGeneral.created_at,
            status: testGeneral.status,
            email_verified: true,
            email_verified_at: testGeneral.created_at,
            invited_by: adminId,
            updated_at: testGeneral.updated_at,
            project_role_id: testProjectRoleId(0, 0),
          }),
        );
      },
    );

    it.each([
      ["project owner", creatorId],
      ["admin", adminId],
      ["other creator", otherCreatorId],
      ["other general", otherGeneral],
      ["anonymous", ""],
    ])(`by %s should not work`, async (_, userId) => {
      const response = await getUser(userId);

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });
  });

  describe("statistics", () => {
    it.each([["user himself", generalId]])(
      "by %s should work",
      async (_, userId) => {
        const response = await getUserStatistic(userId);

        expect(response.status).toBe(HttpStatus.OK);

        expect(response.body).toEqual(
          testSuccessResponse({
            project_users_count: 1,
            projects_count: 0,
            total_projects_count: 1,
          }),
        );
      },
    );

    it.each([["project owner", creatorId]])(
      "by %s should work",
      async (_, userId) => {
        const response = await getUserStatistic(userId);

        expect(response.status).toBe(HttpStatus.FORBIDDEN);
      },
    );

    it.each([
      ["admin", adminId],
      ["other creator", otherCreatorId],
      ["other general", otherGeneral],
      ["anonymous", ""],
    ])(`by %s should not work`, async (_, userId) => {
      const response = await getUser(userId);

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    afterAll(() => testAfterAll(app));
  });
});
