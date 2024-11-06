"use server";

import { cookies } from "next/headers";

import constants from "@repo/constants";

export const updateAppearance = async (value: "light" | "dark") => {
  cookies().set(constants.cookies.appearance, value, {
    path: "/",
  });
};
