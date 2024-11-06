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
  testProjectId,
  testProjectUserId,
  testUserId,
} from "@tests/helpers/factories";
import { testRunMigrations } from "@tests/helpers/run-migrations";
import { testMigrations } from "@tests/migrations";
import { testCreateSession } from "@tests/helpers/create-session";
import { testSuccessResponse } from "@tests/helpers/success-response";
import { testRunProjectStatusMigration } from "@tests/helpers/run-project-status-migration";
import { CreateProjectUserEventSchema } from "@repo/validation";

describe("project user events create", () => {
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
    ]);
  });

  const adminId = testUserId("admin", 0);
  const creatorId = testUserId("creator", 0);
  const generalId = testUserId("general", 0);
  const otherGeneralId = testUserId("general", 1);
  const eventStartDate = new Date("2024-08-14T13:00");
  const eventEndDate = new Date("2024-08-14T15:00");
  const projectUser0Id = testProjectUserId(0, 0);
  const projectUser1Id = testProjectUserId(0, 1);
  const projectId = testProjectId(0);

  const event = testCreateEvent({
    eventIndex: 0,
    startDate: eventStartDate,
    endDate: eventEndDate,
  });

  const eventData: CreateProjectUserEventSchema = {
    title: event.title,
    start_date: event.start_date,
    end_date: event.end_date,
    participants: [projectUser1Id],
  };

  const createEvent = async (
    sessionUserId: User["id"] = generalId,
    projId = projectId,
    body = eventData,
  ) => {
    return request(app.getHttpServer())
      .post(`/projects/${projId}/users/${generalId}/events`)
      .send(body)
      .set({
        cookie:
          sessionUserId &&
          `${constants.cookies.session}=${await testCreateSession(sessionUserId)}`,
      });
  };

  describe("by user owner", () => {
    describe.each(["ready"] satisfies Project["status"][])(
      "when project status is %s",
      (status) => {
        beforeAll(() => testRunProjectStatusMigration(status));

        it("should return created event", async () => {
          const response = await createEvent();

          const [createdEvent] = await queryEvents({
            eventId: response.body.data.id,
          });

          expect(response.status).toBe(HttpStatus.CREATED);
          expect(response.body).toEqual(testSuccessResponse(createdEvent));
        });

        it("should create event participants (including event creator) in db", async () => {
          const response = await createEvent();
          const eventId = response.body.data.id;
          const participants = await queryEventParticipants({ eventId });

          expect(response.status).toBe(HttpStatus.CREATED);

          expect(
            participants.map(
              ({ project_user_id, updated_by, created_by, event_id }) => ({
                updated_by,
                created_by,
                project_user_id,
                event_id,
              }),
            ),
          ).toEqual(
            [...eventData.participants, projectUser0Id].map(
              (participantId) => ({
                updated_by: generalId,
                created_by: generalId,
                project_user_id: participantId,
                event_id: eventId,
              }),
            ),
          );
        });

        it("should create participant for event creator when no participants passed", async () => {
          const response = await createEvent(generalId, projectId, {
            ...eventData,
            participants: [],
          });
          const eventId = response.body.data.id;
          const participants = await queryEventParticipants({ eventId });

          expect(response.status).toBe(HttpStatus.CREATED);

          expect(
            participants.map(
              ({ project_user_id, updated_by, created_by, event_id }) => ({
                updated_by,
                created_by,
                project_user_id,
                event_id,
              }),
            )[0],
          ).toEqual({
            updated_by: generalId,
            created_by: generalId,
            project_user_id: projectUser0Id,
            event_id: eventId,
          });
        });

        it("should return 400 if user passed as participant", async () => {
          const response = await createEvent(generalId, projectId, {
            ...eventData,
            participants: [...eventData.participants, projectUser0Id],
          });

          expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("should return 400 if some of participant is not related to the project", async () => {
          const response = await createEvent(generalId, projectId, {
            ...eventData,
            participants: [...eventData.participants, testProjectUserId(1, 0)],
          });

          expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("should fail validation with invalid body", async () => {
          const response = await createEvent(generalId, projectId, {
            title: "",
            participants: [],
            start_date: new Date("2024-08-09"),
            end_date: new Date("2024-07-09"),
          });

          expect(response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
        });

        it("should not work when project user does not exist", async () => {
          await testRunMigrations([testMigrations.deleteProject0User0]);

          const response = await createEvent();

          expect(response.status).toBe(HttpStatus.FORBIDDEN);
        });
      },
    );

    it.each(["pending", "deleted", "paused"] satisfies Project["status"][])(
      "should not work when project status is %s",
      async (status) => {
        await testRunProjectStatusMigration(status);

        const response = await createEvent();

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
      const response = await createEvent(userId);

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });
  });

  it("should not work when project does not exist", async () => {
    const response = await createEvent(generalId, testProjectId(1));

    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });

  afterAll(() => testAfterAll(app));
});
