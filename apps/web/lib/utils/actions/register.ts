"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { LoginResponse, RegisterResponse } from "@repo/types";
import { RegisterSchema } from "@repo/validation";
import constants from "@repo/constants";

import { authAPI } from "@api/auth";

export const register = async (values: RegisterSchema) => {
  const { email } = await authAPI.post<RegisterResponse>("/register", values);

  const { session, options } = await authAPI.post<LoginResponse>("/login", {
    email,
    password: values.password,
  });

  cookies().set(constants.cookies.session, session, options);

  redirect("/");
};
