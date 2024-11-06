import { HttpStatus, INestApplication } from "@nestjs/common";
import request from "supertest";

import { Project, User } from "@repo/database";
import constants from "@repo/constants";

import { testAfterAll } from "@tests/helpers/after-all";
import { testBeforeAll } from "@tests/helpers/before-all";
import {
  testCreateEvent,
  testCreateEventParticipant,
  testCreateProjectUser,
  testCreateUser,
  testEventId,
  testProjectId,
  testUserId,
} from "@tests/helpers/factories";
import { testRunMigrations } from "@tests/helpers/run-migrations";
import { testMigrations } from "@tests/migrations";
import { testCreateSession } from "@tests/helpers/create-session";
import { testSuccessResponse } from "@tests/helpers/success-response";
import { testRunProjectStatusMigration } from "@tests/helpers/run-project-status-migration";

describe("project user event read", () => {
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
      testMigrations.userGeneral1,
      testMigrations.userGeneral2,
      testMigrations.project0UserCreator0Ready,
      testMigrations.project0Role0,
      testMigrations.project0UserGeneral0Role0,
      testMigrations.project0UserGeneral1Role0,
      testMigrations.project0UserGeneral2Role0,
      testMigrations.event0,
      testMigrations.event0Participant0Proj0User0,
      testMigrations.event0Participant0Proj0User1,
    ]);
  });

  const adminId = testUserId("admin", 0);
  const creatorId = testUserId("creator", 0);
  const otherGeneralParticipantId = testUserId("general", 1);
  const otherGeneralId = testUserId("general", 2);
  const projectId = testProjectId(0);
  const event = testCreateEvent({ eventIndex: 0 });
  const eventOwnerId = event.created_by;

  const user0 = testCreateUser({ role: "general", index: 0 });
  const user1 = testCreateUser({ role: "general", index: 1 });

  const projectUser0 = testCreateProjectUser({
    userRole: "general",
    userIndex: 0,
    projectIndex: 0,
    projectRoleIndex: 0,
    status: "ready",
  });

  const projectUser1 = testCreateProjectUser({
    userRole: "general",
    userIndex: 1,
    projectIndex: 0,
    projectRoleIndex: 0,
    status: "ready",
  });

  const participant0 = testCreateEventParticipant({
    eventIndex: 0,
    projectUserId: projectUser0.id,
  });

  const participant1 = testCreateEventParticipant({
    eventIndex: 0,
    projectUserId: projectUser1.id,
  });

  const successResponse = testSuccessResponse({
    ...event,
    participants: [
      { user: user0, participant: participant0, projectUser: projectUser0 },
      { user: user1, participant: participant1, projectUser: projectUser1 },
    ],
  });

  const getEvent = async (
    sessionUserId: User["id"] = eventOwnerId,
    projId = projectId,
    userId = eventOwnerId,
    eventId = event.id,
  ) => {
    return request(app.getHttpServer())
      .get(`/projects/${projId}/users/${userId}/events/${eventId}`)
      .set({
        cookie:
          sessionUserId &&
          `${constants.cookies.session}=${await testCreateSession(sessionUserId)}`,
      });
  };

  describe.each([
    ["event owner", eventOwnerId],
    ["event participant", otherGeneralParticipantId],
  ])("by %s", (_, userId) => {
    describe.each(["ready", "paused"] satisfies Project["status"][])(
      "when project status is %s",
      (status) => {
        beforeAll(() => testRunProjectStatusMigration(status));

        it("should return event", async () => {
          const response = await getEvent(userId, projectId, userId);

          expect(response.status).toBe(HttpStatus.OK);
          expect(response.body).toEqual(successResponse);
        });

        it("should not work when event does not exist", async () => {
          const response = await getEvent(
            userId,
            projectId,
            userId,
            testEventId(1),
          );

          expect(response.status).toBe(HttpStatus.FORBIDDEN);
        });

        it("should not work when user is not user owner", async () => {
          const response = await getEvent(
            userId,
            projectId,
            testUserId("general", 2),
          );

          expect(response.status).toBe(HttpStatus.FORBIDDEN);
        });
      },
    );

    it.each(["pending", "deleted"] satisfies Project["status"][])(
      "should not work when project status is %s",
      async (status) => {
        await testRunProjectStatusMigration(status);
        const response = await getEvent(userId, projectId, userId);

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
      ["creator", creatorId],
      ["other general", otherGeneralId],
      ["anonymous", ""],
    ])(`by %s should not work`, async (_, userId) => {
      const response = await getEvent(userId);

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });
  });

  it("should not work when project does not exist", async () => {
    const response = await getEvent(eventOwnerId, testProjectId(1));

    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });

  it("should not work when project user does not exists", async () => {
    const notExistingUserId = testUserId("general", 2);

    const response = await getEvent(
      notExistingUserId,
      projectId,
      notExistingUserId,
    );

    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });

  afterAll(() => testAfterAll(app));
});
