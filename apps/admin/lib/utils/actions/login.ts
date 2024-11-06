"use server";

import { cookies } from "next/headers";

import { LoginResponse } from "@repo/types";
import { authAPI } from "@api/auth";
import { LoginSchema } from "@repo/validation";
import constants from "@repo/constants";

export const login = async (values: LoginSchema) => {
  const { session, options } = await authAPI.post<LoginResponse>(
    "/login",
    values,
  );

  cookies().set(constants.cookies.session, session, options);
};
