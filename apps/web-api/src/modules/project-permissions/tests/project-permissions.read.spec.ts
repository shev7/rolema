import { HttpStatus, INestApplication } from "@nestjs/common";
import request from "supertest";

import { Project, User } from "@repo/database";
import constants from "@repo/constants";

import { testAfterAll } from "@tests/helpers/after-all";
import { testBeforeAll } from "@tests/helpers/before-all";
import {
  testCreateProjectPermission,
  testProjectId,
  testUserId,
} from "@tests/helpers/factories";
import { testRunMigrations } from "@tests/helpers/run-migrations";
import { testMigrations } from "@tests/migrations";
import { testCreateSession } from "@tests/helpers/create-session";
import { testSuccessResponse } from "@tests/helpers/success-response";
import { testRunProjectStatusMigration } from "@tests/helpers/run-project-status-migration";

describe("project permissions read", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await testBeforeAll();
  });

  beforeEach(async () => {
    await testRunMigrations([
      testMigrations.clearAll,
      testMigrations.userAdmin0,
      testMigrations.userCreator0,
      testMigrations.userGeneral0,
      testMigrations.userCreator1,
      testMigrations.project0UserCreator0Ready,
      testMigrations.project0Role0,
      testMigrations.project0UserGeneral0Role0,
    ]);
  });

  const projectId = testProjectId(0);
  const adminId = testUserId("admin", 0);
  const creatorId = testUserId("creator", 0);
  const generalId = testUserId("general", 0);
  const otherCreatorId = testUserId("creator", 1);
  const notExistingProjectId = testProjectId(1);

  const getPermissions = async (
    sessionUserId: User["id"] = creatorId,
    projId: Project["id"] = projectId,
  ) => {
    return request(app.getHttpServer())
      .get(`/projects/${projId}/permissions`)
      .set({
        cookie:
          sessionUserId &&
          `${constants.cookies.session}=${await testCreateSession(sessionUserId)}`,
      });
  };

  describe("by project owner", () => {
    it.each(["ready", "paused"] satisfies Project["status"][])(
      "should work when project status is '%s'",
      async (status) => {
        await testRunProjectStatusMigration(status);

        const response = await getPermissions();

        expect(testSuccessResponse([testCreateProjectPermission(0, 0)]));
        expect(response.status).toBe(HttpStatus.OK);
      },
    );

    it.each(["pending", "deleted"] satisfies Project["status"][])(
      "should not work when project status is '%s'",
      async (status) => {
        await testRunProjectStatusMigration(status);

        const response = await getPermissions();

        expect(response.status).toBe(HttpStatus.FORBIDDEN);
      },
    );

    it("should not work if project does not exists", async () => {
      const response = await getPermissions(creatorId, notExistingProjectId);

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });
  });

  describe.each([
    "ready",
    "paused",
    "pending",
    "deleted",
  ] satisfies Project["status"][])("when project status is '%s'", (status) => {
    beforeAll(() => testRunProjectStatusMigration(status));

    it.each([
      ["admin", adminId],
      ["other creator", otherCreatorId],
      ["general", generalId],
      ["anonymous", ""],
    ])(`by %s should not work`, async (_, userId) => {
      const response = await getPermissions(userId);

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });
  });

  afterAll(() => testAfterAll(app));
});
