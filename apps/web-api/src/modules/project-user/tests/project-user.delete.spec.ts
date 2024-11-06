import { HttpStatus, INestApplication } from "@nestjs/common";
import request from "supertest";

import { Project, User } from "@repo/database";
import constants from "@repo/constants";

import { testBeforeAll } from "@tests/helpers/before-all";
import {
  testCreateProjectUser,
  testProjectId,
  testUserId,
} from "@tests/helpers/factories";
import { testRunMigrations } from "@tests/helpers/run-migrations";
import { testMigrations } from "@tests/migrations";
import { testCreateSession } from "@tests/helpers/create-session";
import { testAfterAll } from "@tests/helpers/after-all";
import { testRunProjectStatusMigration } from "@tests/helpers/run-project-status-migration";
import { noop } from "@tests/helpers/noop";

describe("project user delete", () => {
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

  const adminId = testUserId("admin", 0);
  const creatorId = testUserId("creator", 0);
  const generalId = testUserId("general", 0);
  const otherCreatorId = testUserId("creator", 1);
  const projectId = testProjectId(0);

  const deleteProjectUser = async (
    sessionUserId: User["id"] = creatorId,
    userId: User["id"] = generalId,
    projId: Project["id"] = projectId,
  ) => {
    return request(app.getHttpServer())
      .delete(`/projects/${projId}/users/${userId}`)
      .set({
        cookie:
          sessionUserId &&
          `${constants.cookies.session}=${await testCreateSession(sessionUserId)}`,
      });
  };

  describe("by project owner", () => {
    it.each(["ready"] satisfies Project["status"][])(
      "should work when project status is '%s'",
      async (status) => {
        await testRunProjectStatusMigration(status);

        const response = await deleteProjectUser(creatorId);

        const { updated_at, ...data } = response.body.data;

        const { updated_at: _, ...deletedUser } = testCreateProjectUser({
          userIndex: 0,
          userRole: "general",
          projectIndex: 0,
          projectRoleIndex: 0,
          status: "deleted",
        });

        expect(response.status).toBe(HttpStatus.OK);
        expect(data).toEqual(noop(deletedUser));

        expect(new Date(updated_at).valueOf()).toBeGreaterThan(
          new Date(deletedUser.created_at).valueOf(),
        );
      },
    );

    it.each(["paused", "pending", "deleted"] satisfies Project["status"][])(
      "should not work when project status is '%s'",
      async (status) => {
        await testRunProjectStatusMigration(status);

        const response = await deleteProjectUser();

        expect(response.status).toBe(HttpStatus.FORBIDDEN);
      },
    );
  });

  describe.each([
    "ready",
    "paused",
    "pending",
    "deleted",
  ] satisfies Project["status"][])("when project status is '%s'", (status) => {
    beforeEach(() => testRunProjectStatusMigration(status));

    it.each([
      ["admin", adminId],
      ["other creator", otherCreatorId],
      ["general", generalId],
      ["anonymous", ""],
    ])(`by %s should not work`, async (_, userId) => {
      const response = await deleteProjectUser(userId);

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });
  });

  it("when user does not exist should not work", async () => {
    const response = await deleteProjectUser(
      creatorId,
      testUserId("general", 5),
    );

    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });

  afterAll(() => testAfterAll(app));
});
