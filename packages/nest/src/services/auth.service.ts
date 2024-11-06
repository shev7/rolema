import {
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { compare, hash } from "bcrypt";
import { CookieOptions } from "express";

import { getSession, createCookieStore } from "@repo/utils";
import {
  queryUserInfoByEmail,
  queryUserEmailVerificationByToken,
  User,
  setUserPassword,
  queryUserByEmail,
  updateProjectsStatus,
  deleteUserEmailVerificationByEmail,
  updateProjectUser,
} from "@repo/database";
import { LoginResponse, RegisterResponse } from "@repo/types";
import constants from "@repo/constants";

export class AuthService {
  async login(email: User["email"], password: string): Promise<LoginResponse> {
    const userInfo = await queryUserInfoByEmail(email);

    if (!userInfo || !userInfo.password_hash) {
      throw new BadRequestException("Incorrect email or password");
    }

    const isPasswordValid = await compare(password, userInfo.password_hash);

    if (!isPasswordValid) {
      throw new BadRequestException("Incorrect email or password");
    }

    let sessionCookie: string = "";
    let cookieOptions: Partial<CookieOptions> = {};

    const session = await getSession(
      createCookieStore(
        constants.cookies.session,
        "",
        (_name, value, options) => {
          sessionCookie = value;
          cookieOptions = {
            ...(options ?? {}),
            secure: false,
          };
        },
      ),
    );

    session.user_id = userInfo.user_id;

    await session.save();

    return { session: sessionCookie, options: cookieOptions };
  }

  async register(token: string, password: string): Promise<RegisterResponse> {
    const verification = await queryUserEmailVerificationByToken(token);

    if (!verification) {
      throw new BadRequestException("Incorrect token provided");
    }

    const userInfo = await queryUserInfoByEmail(verification.user_email);
    const user = await queryUserByEmail(verification.user_email);

    if (!userInfo || !user) {
      throw new InternalServerErrorException();
    }

    const passwordHash = await hash(password, 10);
    await setUserPassword({ userId: userInfo.user_id, passwordHash });
    await deleteUserEmailVerificationByEmail(user.email);

    if (user.role === "creator") {
      await updateProjectsStatus({
        ownerId: userInfo.user_id,
        newStatus: "ready",
      });
    }

    await updateProjectUser({
      userId: user.id,
      updatedBy: user.id,
      fields: {
        status: "ready",
      },
    });

    return { email: verification.user_email };
  }
}
