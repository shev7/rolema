import { HttpStatus, INestApplication } from "@nestjs/common";
import request from "supertest";

import {
  Project,
  User,
  queryProjectUsers,
  queryUserByEmail,
  queryUserEmailVerificationByUserEmail,
  queryUserInfoByEmail,
} from "@repo/database";
import constants from "@repo/constants";

import { MailService } from "@modules/mail";
import { testAfterAll } from "@tests/helpers/after-all";
import { testBeforeAll } from "@tests/helpers/before-all";
import {
  testProjectId,
  testProjectName,
  testProjectRoleId,
  testUserEmail,
  testUserId,
} from "@tests/helpers/factories";
import { testRunMigrations } from "@tests/helpers/run-migrations";
import { testMigrations } from "@tests/migrations";
import { testCreateSession } from "@tests/helpers/create-session";
import { testRunProjectStatusMigration } from "@tests/helpers/run-project-status-migration";
import { InviteUserToProjectSchema } from "@repo/validation";
import { testSuccessResponse } from "@tests/helpers/success-response";

describe("users invite", () => {
  let app: INestApplication;

  const sendGeneralInvitationMock = jest.fn();

  beforeAll(async () => {
    app = await testBeforeAll((builder) =>
      builder.overrideProvider(MailService).useValue({
        sendGeneralInvitation: sendGeneralInvitationMock,
      }),
    );
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
    ]);
  });

  const creatorId = testUserId("creator", 0);
  const generalId = testUserId("general", 0);
  const generalEmail = testUserEmail("general", 0);
  const creatorEmail = testUserEmail("creator", 0);
  const adminId = testUserId("admin", 0);
  const otherCreatorId = testUserId("creator", 1);
  const newGeneralEmail = testUserEmail("general", 1);

  const body: InviteUserToProjectSchema = {
    email: newGeneralEmail,
    project_role_id: testProjectRoleId(0, 0),
    project_id: testProjectId(0),
  };

  const inviteUser = async (
    sessionUserId: User["id"] = creatorId,
    inviteData: InviteUserToProjectSchema | object = body,
  ) => {
    return request(app.getHttpServer())
      .post(`/users/invite`)
      .send(inviteData)
      .set({
        cookie: `${constants.cookies.session}=${await testCreateSession(sessionUserId)}`,
      });
  };

  describe("by project owner of 'ready' project", () => {
    beforeEach(() => {
      sendGeneralInvitationMock.mockResolvedValue({ rejected: [] });
    });

    describe("when user does not exists", () => {
      it("should create and return user", async () => {
        const response = await inviteUser();
        const createdUser = await queryUserByEmail(newGeneralEmail);

        expect(response.status).toBe(HttpStatus.CREATED);

        expect(response.body).toEqual(
          testSuccessResponse(JSON.parse(JSON.stringify(createdUser))),
        );
      });

      it("should create email_verification record", async () => {
        await inviteUser();

        const emailVerification =
          await queryUserEmailVerificationByUserEmail(newGeneralEmail);

        expect(emailVerification?.token).toBeTruthy();
        expect(emailVerification?.email_sent).toBeTruthy();
        expect(emailVerification?.user_email).toBe(newGeneralEmail);
      });

      it("should not update email_sent when email is rejected", async () => {
        sendGeneralInvitationMock.mockResolvedValue({ rejected: [1] });
        await inviteUser();

        const emailVerification =
          await queryUserEmailVerificationByUserEmail(newGeneralEmail);

        expect(emailVerification?.email_sent).toBeFalsy();
      });

      it("should create user_info record", async () => {
        await inviteUser();
        const createdUser = await queryUserByEmail(newGeneralEmail);
        const userInfo = await queryUserInfoByEmail(newGeneralEmail);

        expect(userInfo?.email_verified).toBeFalsy();
        expect(userInfo?.email_verified_at).toBeNull();
        expect(userInfo?.invited_by).toBe(creatorId);
        expect(userInfo?.password_hash).toBeNull();
        expect(userInfo?.updated_at).toBeInstanceOf(Date);
        expect(userInfo?.updated_by).toBe(creatorId);
        expect(userInfo?.user_id).toBe(createdUser?.id);
      });

      it("should create project_user record", async () => {
        await inviteUser();
        const createdUser = await queryUserByEmail(newGeneralEmail);

        const [projectUser] = await queryProjectUsers({
          userId: createdUser?.id,
        });

        expect(projectUser?.user).toEqual(createdUser);
      });

      it("should send invitation email for new user", async () => {
        await inviteUser();

        const emailVerification =
          await queryUserEmailVerificationByUserEmail(newGeneralEmail);

        expect(sendGeneralInvitationMock).toHaveBeenCalled();

        expect(sendGeneralInvitationMock).toHaveBeenCalledWith({
          toEmail: newGeneralEmail,
          projectName: testProjectName(0),
          projectId: testProjectId(0),
          token: emailVerification?.token,
        });
      });
    });

    describe("when user exists", () => {
      it("but not on project, it should create project user", async () => {
        await testRunMigrations([testMigrations.userGeneral1]);
        await inviteUser();
        const user = await queryUserByEmail(newGeneralEmail);
        const [projectUser] = await queryProjectUsers({ userId: user?.id });

        expect(user).toBeDefined();
        expect(projectUser).toBeDefined();
        expect(user).toEqual(projectUser?.user);
      });

      it("but deleted on project, it should update project user status to 'pending' for 'pending' user", async () => {
        await testRunMigrations([
          testMigrations.userGeneral1Pending,
          testMigrations.project0UserGeneral1DeletedRole0,
        ]);

        await inviteUser();
        const user = await queryUserByEmail(newGeneralEmail);
        const [projectUser] = await queryProjectUsers({ userId: user?.id });

        expect(projectUser?.project_user.status).toEqual("pending");
      });

      it.each(["blocked", "deleted", "ready"] satisfies User["status"][])(
        "but deleted on project, it should update project user status to 'ready' for '%s' user",
        async (status) => {
          await testRunMigrations([
            testMigrations[
              `userGeneral1${(status.at(0)?.toUpperCase() + status.slice(1)) as Capitalize<typeof status>}`
            ],
            testMigrations.project0UserGeneral1DeletedRole0,
          ]);

          await inviteUser();
          const user = await queryUserByEmail(newGeneralEmail);
          const [projectUser] = await queryProjectUsers({ userId: user?.id });

          expect(projectUser?.project_user.status).toEqual("ready");
        },
      );

      it("should send invitation email for existing user", async () => {
        await testRunMigrations([testMigrations.userGeneral1]);
        await inviteUser();

        const emailVerification =
          await queryUserEmailVerificationByUserEmail(newGeneralEmail);

        expect(sendGeneralInvitationMock).toHaveBeenCalled();

        expect(sendGeneralInvitationMock).toHaveBeenCalledWith({
          toEmail: newGeneralEmail,
          projectName: testProjectName(0),
          projectId: testProjectId(0),
          token: emailVerification?.token,
        });
      });

      it("should return existing user", async () => {
        const response = await inviteUser();
        const createdUser = await queryUserByEmail(newGeneralEmail);

        expect(response.status).toBe(HttpStatus.CREATED);

        expect(response.body).toEqual(
          testSuccessResponse(JSON.parse(JSON.stringify(createdUser))),
        );
      });
    });

    it("should return 409 when user is already invited", async () => {
      const response = await inviteUser(creatorId, {
        ...body,
        email: generalEmail,
      });

      expect(response.status).toBe(HttpStatus.CONFLICT);

      expect(response.body?.error?.message).toBe(
        "user already invited to the project",
      );
    });

    it("should return 409 when inviting user to his project", async () => {
      const response = await inviteUser(creatorId, {
        ...body,
        email: creatorEmail,
      });

      expect(response.body?.error?.message).toBe("cannot invite yourself");
      expect(response.status).toBe(HttpStatus.CONFLICT);
    });

    it("should return 404 when unknown project_role_id provided", async () => {
      const response = await inviteUser(creatorId, {
        ...body,
        project_role_id: testProjectRoleId(0, 1),
      });

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body?.error?.message).toBe("project role is not found");
    });
  });

  it.each(["pending", "paused", "deleted"] satisfies Project["status"][])(
    "by project owner of '%s' project should not work",
    async (status) => {
      await testRunProjectStatusMigration(status);

      const response = await inviteUser();

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    },
  );

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
      const response = await inviteUser(userId);

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });
  });

  describe("with invalid body", () => {
    it.each([
      ["empty", HttpStatus.FORBIDDEN, {}],
      [
        "invalid project_role_id",
        HttpStatus.UNPROCESSABLE_ENTITY,
        { ...body, project_role_id: "inv" },
      ],
      [
        "invalid project_id",
        HttpStatus.FORBIDDEN,
        { ...body, project_id: "inv" },
      ],
      [
        "invalid email",
        HttpStatus.UNPROCESSABLE_ENTITY,
        { ...body, email: "inv" },
      ],
    ])(`(%s) should fail with code %s`, async (_, code, body) => {
      const response = await inviteUser(creatorId, body);

      expect(response.status).toBe(code);
    });
  });

  afterAll(() => testAfterAll());
});
