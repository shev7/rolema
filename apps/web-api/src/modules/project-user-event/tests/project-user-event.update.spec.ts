import { HttpStatus, INestApplication } from "@nestjs/common";
import request from "supertest";

import { Project, queryEvents } from "@repo/database";
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
import { UpdateProjectUserEventSchema } from "@repo/validation";
import { DATE_DIFF } from "@tests/constants";

describe("project user event update", () => {
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

  const eventData: UpdateProjectUserEventSchema = {
    title: "updated event",
    start_date: new Date("2021-08-09"),
    end_date: new Date("2021-09-09"),
  };

  const updatedEvent = {
    ...event,
    ...eventData,
  };

  const updateEvent = async (
    sessionUserId = eventOwnerId,
    projId = projectId,
    userId = eventOwnerId,
    eventId = event.id,
    body = eventData,
  ) => {
    return request(app.getHttpServer())
      .patch(`/projects/${projId}/users/${userId}/events/${eventId}`)
      .send(body)
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

        it("should return updated event", async () => {
          const response = await updateEvent();

          expect(response.status).toBe(HttpStatus.OK);
          expect(response.body).toEqual(testSuccessResponse(updatedEvent));
        });

        it("should update event in db", async () => {
          const response = await updateEvent();
          const [dbEvent] = await queryEvents({ eventId: event.id });

          expect(response.status).toBe(HttpStatus.OK);
          expect(dbEvent).toEqual(updatedEvent);
        });

        it("should return 400 when start_date is not before event.end_date", async () => {
          const response = await updateEvent(
            eventOwnerId,
            projectId,
            eventOwnerId,
            event.id,
            { start_date: new Date(event.end_date.getTime() + DATE_DIFF) },
          );

          expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("should return 400 when event.start_date is not before end_date", async () => {
          const response = await updateEvent(
            eventOwnerId,
            projectId,
            eventOwnerId,
            event.id,
            { end_date: new Date(event.start_date.getTime() - DATE_DIFF) },
          );

          expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("should fail when event does not exists", async () => {
          const response = await updateEvent(
            eventOwnerId,
            projectId,
            eventOwnerId,
            testEventId(1),
          );

          expect(response.status).toBe(HttpStatus.FORBIDDEN);
        });

        it("should fail when user is not user owner", async () => {
          const response = await updateEvent(
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
        const response = await updateEvent();

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
      const response = await updateEvent(userId);

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });
  });

  it("should not work when project does not exist", async () => {
    const response = await updateEvent(eventOwnerId, testProjectId(1));

    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });

  it("should not work when project user does not exists", async () => {
    const notExistingUserId = testUserId("general", 2);

    const response = await updateEvent(
      notExistingUserId,
      projectId,
      notExistingUserId,
    );

    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });

  it("should fail validation with invalid body", async () => {
    const response = await updateEvent(
      eventOwnerId,
      projectId,
      eventOwnerId,
      event.id,
      {},
    );

    expect(response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });

  it("should fail validation when start_date is not before end_date", async () => {
    const response = await updateEvent(
      eventOwnerId,
      projectId,
      eventOwnerId,
      event.id,
      { start_date: new Date(), end_date: new Date(Date.now() - DATE_DIFF) },
    );

    expect(response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });

  afterAll(() => testAfterAll(app));
});
