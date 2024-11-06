import { HttpStatus, INestApplication } from "@nestjs/common";
import request from "supertest";

import { Project, User } from "@repo/database";
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
import { testCreateEventMigration } from "@tests/migrations/create-event-migration";
import { testCreateEventParticipantMigration } from "@tests/migrations/create-event-participant-migration";
import { DATE_DIFF } from "@tests/constants";

describe("project user events read", () => {
  let app: INestApplication;

  const adminId = testUserId("admin", 0);
  const creatorId = testUserId("creator", 0);
  const generalId = testUserId("general", 0);
  const otherGeneralId = testUserId("general", 1);
  const startDateParam = new Date("2024-08-14");
  const endDateParam = new Date("2024-08-15");
  const eventStartDate = new Date("2024-08-14T13:00");
  const eventEndDate = new Date("2024-08-14T15:00");
  const projectUserId = testProjectUserId(0, 0);
  const projectId = testProjectId(0);

  const event = testCreateEvent({
    eventIndex: 0,
    startDate: eventStartDate,
    endDate: eventEndDate,
  });

  beforeAll(async () => {
    app = await testBeforeAll();
  });

  beforeEach(async () => {
    await testRunMigrations([
      testMigrations.clearAll,
      testMigrations.userAdmin0,
      testMigrations.userCreator0,
      testMigrations.userGeneral0,
      testMigrations.project0UserCreator0Ready,
      testMigrations.project0Role0,
      testMigrations.project0UserGeneral0Role0,
      testCreateEventMigration({
        eventIndex: 0,
        startDate: eventStartDate,
        endDate: eventEndDate,
      }),
      testCreateEventParticipantMigration({
        eventIndex: 0,
        projectUserId,
      }),
    ]);
  });

  const getProjectsUserEvents = async (
    sessionUserId: User["id"] = generalId,
    projId = projectId,
    startDate: Date | null = startDateParam,
    endDate: Date | null = endDateParam,
    userId = generalId,
  ) => {
    return request(app.getHttpServer())
      .get(
        `/projects/${projId}/users/${userId}/events?start_date=${startDate}&end_date=${endDate}`,
      )
      .set({
        cookie:
          sessionUserId &&
          `${constants.cookies.session}=${await testCreateSession(sessionUserId)}`,
      });
  };

  describe("by user owner", () => {
    describe.each(["ready", "paused"] satisfies Project["status"][])(
      "when project status is %s",
      (status) => {
        beforeAll(() => testRunProjectStatusMigration(status));

        it("should return events from date range", async () => {
          const response = await getProjectsUserEvents();

          expect(response.status).toBe(HttpStatus.OK);
          expect(response.body).toEqual(testSuccessResponse([event]));
        });

        it("should return empty array when no events within date range", async () => {
          const response = await getProjectsUserEvents(
            generalId,
            projectId,
            new Date("2023-08-09"),
            new Date("2023-08-19"),
          );

          expect(response.status).toBe(HttpStatus.OK);
          expect(response.body).toEqual(testSuccessResponse([]));
        });
      },
    );

    it.each(["pending", "deleted"] satisfies Project["status"][])(
      "should not work when project status is %s",
      async (status) => {
        await testRunProjectStatusMigration(status);

        const response = await getProjectsUserEvents();

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
      const response = await getProjectsUserEvents(userId);

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });
  });

  it("should not work when project does not exist", async () => {
    const response = await getProjectsUserEvents(creatorId, testProjectId(1));

    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });

  it("should not work when project user does not exist", async () => {
    const response = await getProjectsUserEvents(
      generalId,
      projectId,
      startDateParam,
      endDateParam,
      testUserId("general", 1),
    );

    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });

  it("should fail validation when date range is not provided", async () => {
    const response = await getProjectsUserEvents(
      generalId,
      projectId,
      null,
      null,
    );

    expect(response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });

  it("should fail validation when start_date is not before end_date", async () => {
    const response = await getProjectsUserEvents(
      generalId,
      projectId,
      new Date(),
      new Date(Date.now() - DATE_DIFF),
    );

    expect(response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });

  afterAll(() => testAfterAll(app));
});
