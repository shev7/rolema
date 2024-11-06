import { HttpStatus, INestApplication } from "@nestjs/common";
import request from "supertest";

import constants from "@repo/constants";

import { testMigrations } from "@tests/migrations";
import { testBeforeAll } from "@tests/helpers/before-all";
import { testCreateSession } from "@tests/helpers/create-session";
import { testRunMigrations } from "@tests/helpers/run-migrations";
import {
  testCreateProject,
  testProjectId,
  testUserId,
} from "@tests/helpers/factories";
import { testAfterAll } from "@tests/helpers/after-all";
import { noop } from "@tests/helpers/noop";

describe("project update", () => {
  let app: INestApplication;

  const body = {
    project: {
      name: "project 0 modified",
      description: "project 0 description modified",
    },
  };

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

  const update = async (userId?: string, body?: any) =>
    await request(app.getHttpServer())
      .patch(`/projects/${testProjectId(0)}`)
      .send(body)
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
      const creatorId = testUserId("creator", 0);
      const response = await update(creatorId, body);

      const { updated_at, ...data } = response.body.data;

      const { updated_at: _, ...project } = testCreateProject({
        projectIndex: 0,
        userRole: "creator",
        userIndex: 0,
        projectStatus: "ready",
        updatedBy: creatorId,
      });

      expect(data).toEqual(noop({ ...project, ...body.project }));
      expect(new Date(updated_at).valueOf()).toBeGreaterThan(
        new Date(data.created_at).valueOf(),
      );
    });

    it("with invalid data should not work", async () => {
      const creatorId = testUserId("creator", 0);

      const [response0, response1, response2, response3] = await Promise.all([
        update(creatorId, {
          project: {
            name: body.project.name,
          },
        }),
        update(creatorId, {
          project: {
            description: body.project.description,
          },
        }),
        update(creatorId, {
          project: {
            name: "",
            description: body.project.description,
          },
        }),
        update(creatorId, {
          project: {
            name: body.project.name,
            description: "",
          },
        }),
      ]);

      expect(response0.status).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(response0.body.error.message).toEqual("validation failed");
      expect(response1.status).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(response1.body.error.message).toEqual("validation failed");
      expect(response2.status).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(response2.body.error.message).toEqual("validation failed");
      expect(response3.status).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(response3.body.error.message).toEqual("validation failed");
    });

    it("by other creator should not work", async () => {
      await testRunMigrations([testMigrations.userCreator1]);

      const response = await update(testUserId("creator", 1), body);

      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });

    it("by admin should not work", async () => {
      const response = await update(testUserId("admin", 0), body);

      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });

    it("by anonymous should not work", async () => {
      const response = await update(undefined, body);

      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });
  });

  describe("paused", () => {
    beforeEach(async () => {
      await testRunMigrations([testMigrations.project0UserCreator0Paused]);
    });

    it("by creator should not work", async () => {
      const response = await update(testUserId("creator", 0), body);

      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });

    it("by other creator should not work", async () => {
      const response = await update(testUserId("creator", 1), body);

      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });

    it("by admin should not work", async () => {
      const response = await update(testUserId("admin", 0), body);

      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });

    it("by anonymous should not work", async () => {
      const response = await update(testUserId("admin", 0), body);

      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });
  });

  describe("deleted", () => {
    beforeEach(async () => {
      await testRunMigrations([testMigrations.project0UserCreator0Deleted]);
    });

    it("by creator should not work", async () => {
      const response = await update(testUserId("creator", 0), body);

      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });

    it("by other creator should not work", async () => {
      const response = await update(testUserId("admin", 0), body);

      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });

    it("by admin should not work", async () => {
      const response = await update(testUserId("admin", 0), body);

      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });

    it("by anonymous should not work", async () => {
      const response = await update(testUserId("admin", 0), body);

      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });
  });

  afterAll(async () => {
    await testAfterAll(app);
  });
});
