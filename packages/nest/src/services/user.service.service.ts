import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";

import {
  queryUserAllById,
  deleteProjectsByOwnerId,
  deleteUserById,
  queryUserStatistics,
  updateUserStatus,
} from "@repo/database";

import { UserServiceBase } from "../types";

export class UserService implements UserServiceBase {
  getUser: UserServiceBase["getUser"] = async (userId) => {
    const response = await queryUserAllById(userId);

    if (!response) {
      throw new NotFoundException("User is not found.");
    } else if (!response.invited_by || !response.updated_at) {
      throw new InternalServerErrorException(
        `There is no user info for ${userId}`,
      );
    }

    return response;
  };

  deleteUser: UserServiceBase["deleteUser"] = async (userId) => {
    const user = await queryUserAllById(userId);

    if (!user) {
      throw new NotFoundException("User is not found.");
    }

    if (user.email_verified) {
      throw new BadRequestException("Can not delete verified user.");
    } else if (user.role === "general") {
      throw new BadRequestException("Can not delete user whos role is general");
    }

    if (user.role === "creator") {
      await deleteProjectsByOwnerId({
        ownerId: userId,
      });
    }

    await deleteUserById(userId);
  };

  getUserStatistics: UserServiceBase["getUserStatistics"] = (userId) => {
    return queryUserStatistics(userId);
  };

  updateUserStatus: UserServiceBase["updateUserStatus"] = async (
    id,
    status,
    updatedBy,
  ) => {
    const user = await updateUserStatus({
      id,
      status,
      updatedBy,
    });

    if (!user) {
      throw new NotFoundException("User is not found.");
    }

    return user;
  };
}
