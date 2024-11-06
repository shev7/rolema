import { HttpStatus, INestApplication } from "@nestjs/common";
import request from "supertest";

import {
  Project,
  queryEvents,
  queryEventParticipants,
  User,
} from "@repo/database";
import constants from "@repo/constants";

import { testAfterAll } from "@tests/helpers/after-all";
import { testBeforeAll } from "@tests/helpers/before-all";
import {
  testCreateEvent,
  testEventId,
  testProjectId,
  testUserId,
} from "@tests/helpers/factories";
import { testRunMigrations } from "@tests/helpers/run-migrations";
import { testMigrations } from "@tests/migrations";
import { testCreateSession } from "@tests/helpers/create-session";
import { testSuccessResponse } from "@tests/helpers/success-response";
import { testRunProjectStatusMigration } from "@tests/helpers/run-project-status-migration";

describe("project user event delete", () => {
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
      testMigrations.project0UserCreator0Ready,
      testMigrations.project0Role0,
      testMigrations.project0UserGeneral0Role0,
      testMigrations.project0UserGeneral1Role0,
      testMigrations.event0,
      testMigrations.event0Participant0Proj0User0,
      testMigrations.event0Participant0Proj0User1,
    ]);
  });

  const adminId = testUserId("admin", 0);
  const creatorId = testUserId("creator", 0);
  const otherGeneralId = testUserId("general", 1);
  const projectId = testProjectId(0);
  const event = testCreateEvent({ eventIndex: 0 });
  const eventOwnerId = event.created_by;

  const deleteEvent = async (
    sessionUserId: User["id"] = eventOwnerId,
    projId = projectId,
    userId = eventOwnerId,
    eventId = event.id,
  ) => {
    return request(app.getHttpServer())
      .delete(`/projects/${projId}/users/${userId}/events/${eventId}`)
      .set({
        cookie:
          sessionUserId &&
          `${constants.cookies.session}=${await testCreateSession(sessionUserId)}`,
      });
  };

  describe("by event owner", () => {
    describe.each(["ready"] satisfies Project["status"][])(
      "when project status is %s",
      (status) => {
        beforeAll(() => testRunProjectStatusMigration(status));

        it("should return deleted event", async () => {
          const response = await deleteEvent();

          expect(response.status).toBe(HttpStatus.OK);
          expect(response.body).toEqual(testSuccessResponse(event));
        });

        it("should delete event from db", async () => {
          const response = await deleteEvent();
          const [dbEvent] = await queryEvents({ eventId: event.id });

          expect(response.status).toBe(HttpStatus.OK);
          expect(dbEvent).toBeUndefined();
        });

        it("should delete event participants from db", async () => {
          const response = await deleteEvent();

          const participants = await queryEventParticipants({
            eventId: event.id,
          });

          expect(response.status).toBe(HttpStatus.OK);
          expect(participants).toHaveLength(0);
        });

        it("should fail when event does not exist", async () => {
          const response = await deleteEvent(
            eventOwnerId,
            projectId,
            eventOwnerId,
            testEventId(1),
          );

          expect(response.status).toBe(HttpStatus.FORBIDDEN);
        });

        it("should fail when user is not user owner", async () => {
          const response = await deleteEvent(
            eventOwnerId,
            projectId,
            otherGeneralId,
          );

          expect(response.status).toBe(HttpStatus.FORBIDDEN);
        });
      },
    );

    it.each(["pending", "deleted", "paused"] satisfies Project["status"][])(
      "should not work when project status is %s",
      async (status) => {
        await testRunProjectStatusMigration(status);
        const response = await deleteEvent();

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
      const response = await deleteEvent(userId);

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });
  });

  it("should not work when project does not exist", async () => {
    const response = await deleteEvent(eventOwnerId, testProjectId(1));

    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });

  it("should not work when project user does not exists", async () => {
    const notExistingUserId = testUserId("general", 2);

    const response = await deleteEvent(
      notExistingUserId,
      projectId,
      notExistingUserId,
    );

    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });

  afterAll(() => testAfterAll(app));
});
