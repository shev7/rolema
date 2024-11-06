import { DatabaseError } from "pg";

import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";

import {
  queryUsers,
  queryUsersCountGroupedByRole,
  QueryUsersProps,
  setUserEmailSent,
  queryUserByEmail,
  inviteUser,
  queryProjectById,
  queryProjectUsers,
  ProjectUser,
  createProjectUser,
  updateProjectUser,
  queryUserEmailVerifiedAndVerificationTokenById,
} from "@repo/database";
import { dayjs } from "@repo/utils";
import constants from "@repo/constants";

import { MailService } from "./mail.service";
import { UsersServiceBase } from "../types";

export class UsersService implements UsersServiceBase {
  constructor(protected readonly mailService: MailService) {}

  getUsersStatistic: UsersServiceBase["getUsersStatistic"] = async () => {
    const data = await queryUsersCountGroupedByRole();

    return data.reduce(
      (acc, { count, role }) => {
        return {
          ...acc,
          [role]: count,
          total: acc.total + count,
        };
      },
      {
        total: 0,
        admin: 0,
        creator: 0,
        general: 0,
      },
    );
  };

  getUsers: UsersServiceBase["getUsers"] = (props?: QueryUsersProps) => {
    return queryUsers(props);
  };

  inviteCreatorUser: UsersServiceBase["inviteCreatorUser"] = async ({
    email,
    invitedBy,
    project,
    project_tier,
  }) => {
    const user = await queryUserByEmail(email);

    if (user) {
      throw new ConflictException("User already exists.");
    }

    const { user: invitedUser, token } = await inviteUser({
      userEmail: email,
      invitedBy,
      role: "creator",
      project,
      projectTier: {
        tier_id: project_tier.tier_id,
        ends_at: dayjs()
          .add(Number(project_tier.duration), "days")
          .endOf("day")
          .toDate(),
      },
    });

    if (!invitedUser) {
      throw new InternalServerErrorException();
    }

    const { rejected } = await this.mailService.sendCreatorInvitation({
      toEmail: email,
      token,
    });

    if (!rejected.length) {
      await setUserEmailSent({
        userEmail: email,
        emailSent: true,
      });
    }

    return invitedUser;
  };

  inviteGeneralUser: UsersServiceBase["inviteGeneralUser"] = async ({
    email,
    project_id,
    project_role_id,
    inviterId,
  }) => {
    try {
      const project = await queryProjectById({ projectId: project_id });

      if (!project) {
        throw new NotFoundException("project is not found");
      }

      const user = await queryUserByEmail(email);

      if (!user) {
        const { user: invitedUser, token } = await inviteUser({
          userEmail: email,
          invitedBy: inviterId,
          role: "general",
          projectUser: {
            project_id,
            project_role_id,
          },
        });

        if (!invitedUser) {
          throw new InternalServerErrorException();
        }

        const { rejected } = await this.mailService.sendGeneralInvitation({
          toEmail: email,
          projectName: project.name,
          projectId: project_id,
          token,
        });

        if (!rejected.length) {
          await setUserEmailSent({
            userEmail: email,
            emailSent: true,
          });
        }

        return invitedUser;
      }

      if (user.id === project.owner_id) {
        throw new ConflictException("cannot invite yourself");
      }

      const [previousProjectUser] = await queryProjectUsers({
        projectId: project_id,
        userId: user.id,
      });

      let projectUser: ProjectUser | undefined = undefined;

      if (!previousProjectUser?.project_user) {
        projectUser = await createProjectUser({
          project_id,
          project_role_id,
          user_id: user.id,
          updated_by: inviterId,
        });
      } else if (previousProjectUser.project_user.status === "deleted") {
        projectUser = await updateProjectUser({
          userId: user.id,
          projectId: project_id,
          updatedBy: inviterId,
          fields: {
            status: user.status === "pending" ? "pending" : "ready",
          },
        });
      } else {
        throw new ConflictException("user already invited to the project");
      }

      if (!projectUser) {
        throw new InternalServerErrorException();
      }

      const data = await queryUserEmailVerifiedAndVerificationTokenById(
        user.id,
      );

      await this.mailService.sendGeneralInvitation({
        toEmail: email,
        projectName: project.name,
        projectId: project_id,
        token: data?.email_verified ? undefined : data?.token,
      });

      return user;
    } catch (error) {
      if (error instanceof DatabaseError) {
        if (
          error.constraint ===
          constants.database.project_user.projectUniqueUserConstraint
        ) {
          throw new ConflictException("user already invited to the project");
        }

        if (
          error.constraint ===
          constants.database.project_user.project_role_id.foreignKeyConstraint
        ) {
          throw new NotFoundException("project role is not found");
        }
      }

      throw error;
    }
  };
}
