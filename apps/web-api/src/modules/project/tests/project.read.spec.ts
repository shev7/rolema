import { HttpStatus, INestApplication } from "@nestjs/common";
import request from "supertest";

import constants from "@repo/constants";

import { testBeforeAll } from "@tests/helpers/before-all";
import { testMigrations } from "@tests/migrations";
import { testCreateSession } from "@tests/helpers/create-session";
import { testAfterAll } from "@tests/helpers/after-all";
import { testSuccessResponse } from "@tests/helpers/success-response";
import { testRunMigrations } from "@tests/helpers/run-migrations";
import {
  testCreateProject,
  testProjectId,
  testUserId,
} from "@tests/helpers/factories";

describe("project read", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await testBeforeAll();
  });

  beforeEach(async () => {
    await testRunMigrations([
      testMigrations.clearAll,
      testMigrations.userAdmin0,
      testMigrations.tier0,
      testMigrations.userCreator0,
    ]);
  });

  const read = async (userId?: string) =>
    await request(app.getHttpServer())
      .get(`/projects/${testProjectId(0)}`)
      .set({
        cookie: userId
          ? `${constants.cookies.session}=${await testCreateSession(userId)}`
          : "",
      });

  describe("ready", () => {
    beforeEach(async () => {
      await testRunMigrations([testMigrations.project0UserCreator0Ready]);
    });

    it("by creator should work", async () => {
      const response = await read(testUserId("creator", 0));

      expect(response.body).toEqual(
        testSuccessResponse(
          testCreateProject({
            projectIndex: 0,
            userRole: "creator",
            userIndex: 0,
            projectStatus: "ready",
          }),
        ),
      );
    });

    it("by other creator should not work", async () => {
      await testRunMigrations([testMigrations.userCreator1]);

      const response = await read(testUserId("creator", 1));

      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });

    it("by admin should not work", async () => {
      const response = await read(testUserId("admin", 0));

      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });

    it("by anonymous should not work", async () => {
      const response = await read();

      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });
  });

  describe("paused", () => {
    beforeEach(async () => {
      await testRunMigrations([testMigrations.project0UserCreator0Paused]);
    });

    it("by creator should not work", async () => {
      const response = await read(testUserId("creator", 0));

      expect(response.status).toEqual(HttpStatus.OK);
    });

    it("by other creator should not work", async () => {
      await testRunMigrations([testMigrations.userCreator1]);

      const response = await read(testUserId("creator", 1));

      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });

    it("by admin should not work", async () => {
      const response = await read(testUserId("admin", 0));

      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });

    it("by anonymous should not work", async () => {
      const response = await read();

      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });
  });

  describe("pending", () => {
    beforeEach(async () => {
      await testRunMigrations([testMigrations.project0UserCreator0Pending]);
    });

    it("by creator should not work", async () => {
      const response = await read(testUserId("creator", 0));

      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });

    it("by other creator should not work", async () => {
      await testRunMigrations([testMigrations.userCreator1]);

      const response = await read(testUserId("creator", 1));

      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });

    it("by admin should not work", async () => {
      const response = await read(testUserId("admin", 0));

      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });

    it("by anonymous should not work", async () => {
      const response = await read();

      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });
  });

  describe("deleted", () => {
    beforeEach(async () => {
      await testRunMigrations([testMigrations.project0UserCreator0Deleted]);
    });

    it("by creator should not work", async () => {
      const response = await read(testUserId("creator", 0));

      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });

    it("by other creator should not work", async () => {
      await testRunMigrations([testMigrations.userCreator1]);

      const response = await read(testUserId("creator", 1));

      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });

    it("by admin should not work", async () => {
      const response = await read(testUserId("admin", 0));

      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });

    it("by anonymous should not work", async () => {
      const response = await read();

      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });
  });

  afterAll(async () => {
    await testAfterAll(app);
  });
});
