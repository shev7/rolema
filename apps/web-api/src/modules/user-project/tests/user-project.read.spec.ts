import { HttpStatus, INestApplication } from "@nestjs/common";
import request from "supertest";

import { Project, User } from "@repo/database";
import constants from "@repo/constants";

import { testAfterAll } from "@tests/helpers/after-all";
import { testBeforeAll } from "@tests/helpers/before-all";
import {
  testCreateProject,
  testProjectId,
  testUserId,
} from "@tests/helpers/factories";
import { testRunMigrations } from "@tests/helpers/run-migrations";
import { testMigrations } from "@tests/migrations";
import { testCreateSession } from "@tests/helpers/create-session";
import { testSuccessResponse } from "@tests/helpers/success-response";
import { testRunProjectStatusMigration } from "@tests/helpers/run-project-status-migration";

describe("user project read", () => {
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
      testMigrations.userGeneral0,
      testMigrations.project0UserCreator0Ready,
      testMigrations.project0Role0,
      testMigrations.project0UserGeneral0Role0,
    ]);
  });

  const creatorId = testUserId("creator", 0);
  const generalId = testUserId("general", 0);
  const adminId = testUserId("admin", 0);
  const otherCreatorId = testUserId("creator", 1);

  const getProject = async (
    sessionUserId: User["id"] = creatorId,
    userId: User["id"] = creatorId,
    projectId: Project["id"] = testProjectId(0),
  ) => {
    return request(app.getHttpServer())
      .get(`/users/${userId}/projects/${projectId}`)
      .set({
        cookie: `${constants.cookies.session}=${await testCreateSession(sessionUserId)}`,
      });
  };

  describe("by project owner", () => {
    it.each(["ready", "paused"] satisfies Project["status"][])(
      "should work when project status is '%s'",
      async (status) => {
        await testRunProjectStatusMigration(status);

        const response = await getProject();

        expect(response.status).toBe(HttpStatus.OK);

        expect(response.body).toEqual(
          testSuccessResponse({
            ...testCreateProject({
              projectIndex: 0,
              userRole: "creator",
              userIndex: 0,
              projectStatus: status,
            }),
            roles_count: 1,
            users_count: 1,
          }),
        );
      },
    );

    it.each(["pending", "deleted"] satisfies Project["status"][])(
      "should return 404 when project status is '%s'",
      async (status) => {
        await testRunProjectStatusMigration(status);

        const response = await getProject();

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
      },
    );

    it("should return 404 when project does not exists", async () => {
      const response = await getProject(creatorId, creatorId, testProjectId(1));

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
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
      const response = await getProject(userId);

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });
  });

  afterAll(() => testAfterAll(app));
});
