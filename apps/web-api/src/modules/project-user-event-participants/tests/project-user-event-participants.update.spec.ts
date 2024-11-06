import { HttpStatus, INestApplication } from "@nestjs/common";
import request from "supertest";

import { Project, queryEventParticipants, User } from "@repo/database";
import constants from "@repo/constants";

import { testAfterAll } from "@tests/helpers/after-all";
import { testBeforeAll } from "@tests/helpers/before-all";
import {
  testCreateEvent,
  testCreateEventParticipant,
  testEventId,
  testProjectId,
  testProjectUserId,
  testUserId,
} from "@tests/helpers/factories";
import { testRunMigrations } from "@tests/helpers/run-migrations";
import { testMigrations } from "@tests/migrations";
import { testCreateSession } from "@tests/helpers/create-session";
import { testRunProjectStatusMigration } from "@tests/helpers/run-project-status-migration";

describe("project user event participants update", () => {
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

  const addedParticipant = testCreateEventParticipant({
    eventIndex: 0,
    projectUserId: testProjectUserId(0, 2),
  });

  const removedParticipant = testCreateEventParticipant({
    eventIndex: 0,
    projectUserId: testProjectUserId(0, 1),
  });

  const eventOwnerParticipant = testCreateEventParticipant({
    eventIndex: 0,
    projectUserId: testProjectUserId(0, 0),
  });

  const updateParticipants = async (
    sessionUserId: User["id"] = eventOwnerId,
    projId = projectId,
    userId = eventOwnerId,
    eventId = event.id,
    body = [addedParticipant.project_user_id],
  ) => {
    return request(app.getHttpServer())
      .patch(
        `/projects/${projId}/users/${userId}/events/${eventId}/participants`,
      )
      .set({
        cookie:
          sessionUserId &&
          `${constants.cookies.session}=${await testCreateSession(sessionUserId)}`,
      })
      .send(body);
  };

  describe("by event owner", () => {
    describe.each(["ready"] satisfies Project["status"][])(
      "when project status is %s",
      (status) => {
        beforeAll(() => testRunProjectStatusMigration(status));

        it("should return added participants", async () => {
          const response = await updateParticipants();

          expect(response.status).toBe(HttpStatus.OK);
          expect(response.body.data).toHaveLength(1);
          expect(response.body.data[0].event_id).toEqual(
            addedParticipant.event_id,
          );
          expect(response.body.data[0].project_user_id).toEqual(
            addedParticipant.project_user_id,
          );
        });

        it("should remove from db old participants that was not provided", async () => {
          const response = await updateParticipants();

          const participants = await queryEventParticipants({
            eventId: event.id,
          });

          expect(response.status).toBe(HttpStatus.OK);
          expect(participants).not.toContainEqual(removedParticipant);
        });

        it("should add new participants to db", async () => {
          const response = await updateParticipants();

          const participants = await queryEventParticipants({
            eventId: event.id,
          });

          expect(response.status).toBe(HttpStatus.OK);

          expect(
            participants.find(
              (participant) =>
                participant.project_user_id ===
                addedParticipant.project_user_id,
            ),
          ).toBeTruthy();
        });

        it("should not touch event owner participant", async () => {
          const response = await updateParticipants();

          const participants = await queryEventParticipants({
            eventId: event.id,
          });

          expect(response.status).toBe(HttpStatus.OK);
          expect(participants).toContainEqual(eventOwnerParticipant);
        });

        it("should not touch existing participants that was provided", async () => {
          const response = await updateParticipants(
            eventOwnerId,
            projectId,
            eventOwnerId,
            event.id,
            [
              addedParticipant.project_user_id,
              removedParticipant.project_user_id,
            ],
          );

          const participants = await queryEventParticipants({
            eventId: event.id,
          });

          expect(response.status).toBe(HttpStatus.OK);

          expect(participants).toContainEqual(removedParticipant);
        });

        it("should not work when event does not exist", async () => {
          const response = await updateParticipants(
            eventOwnerId,
            projectId,
            eventOwnerId,
            testEventId(1),
          );

          expect(response.status).toBe(HttpStatus.FORBIDDEN);
        });

        it("should not work when user is not user owner", async () => {
          const response = await updateParticipants(
            eventOwnerId,
            projectId,
            testUserId("general", 2),
          );

          expect(response.status).toBe(HttpStatus.FORBIDDEN);
        });

        it("should return 400 event owner provided in the array", async () => {
          const response = await updateParticipants(
            eventOwnerId,
            projectId,
            eventOwnerId,
            event.id,
            [eventOwnerParticipant.project_user_id],
          );

          expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("should return 400 event participant is not related to the project", async () => {
          const response = await updateParticipants(
            eventOwnerId,
            projectId,
            eventOwnerId,
            event.id,
            [testProjectUserId(1, 0)],
          );

          expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        });
      },
    );

    it.each(["pending", "deleted", "paused"] satisfies Project["status"][])(
      "should not work when project status is %s",
      async (status) => {
        await testRunProjectStatusMigration(status);
        const response = await updateParticipants();

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
      ["other participant", otherGeneralParticipantId],
      ["anonymous", ""],
    ])(`by %s should not work`, async (_, userId) => {
      const response = await updateParticipants(userId);

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });
  });

  it("should not work when project does not exist", async () => {
    const response = await updateParticipants(eventOwnerId, testProjectId(1));

    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });

  it("should not work when project user does not exists", async () => {
    const notExistingUserId = testUserId("general", 2);

    const response = await updateParticipants(
      notExistingUserId,
      projectId,
      notExistingUserId,
    );

    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });

  it("should fail validation with empty participants array", async () => {
    const response = await updateParticipants(
      eventOwnerId,
      projectId,
      eventOwnerId,
      event.id,
      [],
    );

    expect(response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });

  it("should fail validation with invalid ids provided", async () => {
    const response = await updateParticipants(
      eventOwnerId,
      projectId,
      eventOwnerId,
      event.id,
      ["123"],
    );

    expect(response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });

  afterAll(() => testAfterAll(app));
});
