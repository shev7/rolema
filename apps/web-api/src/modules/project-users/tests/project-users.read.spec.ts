import { HttpStatus, INestApplication } from "@nestjs/common";
import request from "supertest";

import { Project, User } from "@repo/database";
import constants from "@repo/constants";

import { testAfterAll } from "@tests/helpers/after-all";
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
import { testRunProjectStatusMigration } from "@tests/helpers/run-project-status-migration";

describe("project users read", () => {
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

  const getProjectsUsers = async (
    sessionUserId: User["id"] = creatorId,
    projectId = testProjectId(0),
  ) => {
    return request(app.getHttpServer())
      .get(`/projects/${projectId}/users`)
      .set({
        cookie:
          sessionUserId &&
          `${constants.cookies.session}=${await testCreateSession(sessionUserId)}`,
      });
  };

  describe("by project owner", () => {
    it.each(["ready", "paused"] satisfies Project["status"][])(
      "should work when project status is %s",
      async (status) => {
        await testRunProjectStatusMigration(status);

        const response = await getProjectsUsers();

        expect(response.status).toBe(HttpStatus.OK);

        const project = testCreateProject({
          projectIndex: 0,
          userRole: "creator",
          userIndex: 0,
          projectStatus: "ready",
        });

        const userInfo = testCreateUserInfo({ role: "general", index: 0 });

        expect(response.body).toEqual(
          testSuccessResponse([
            {
              project_user: testCreateProjectUser({
                projectIndex: 0,
                userIndex: 0,
                userRole: "general",
                projectRoleIndex: 0,
              }),
              project_role: testCreateProjectRole({
                projectIndex: 0,
                roleIndex: 0,
              }),
              user: testCreateUser({ index: 0, role: "general" }),
              user_info: {
                email_verified: userInfo.email_verified,
                email_verified_at: userInfo.email_verified_at,
              },
              project: {
                id: project.id,
                name: project.name,
                description: project.description,
                status,
              },
            },
          ]),
        );
      },
    );

    it.each(["pending", "deleted"] satisfies Project["status"][])(
      "should not work when project status is %s",
      async (status) => {
        await testRunProjectStatusMigration(status);

        const response = await getProjectsUsers();

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
    beforeAll(() => testRunProjectStatusMigration(status));

    it.each([
      ["admin", adminId],
      ["other creator", otherCreatorId],
      ["general", generalId],
      ["anonymous", ""],
    ])(`by %s should not work`, async (_, userId) => {
      const response = await getProjectsUsers(userId);

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });
  });

  it("should not work when project does not exist", async () => {
    const response = await getProjectsUsers(creatorId, testProjectId(1));

    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });

  afterAll(() => testAfterAll(app));
});
