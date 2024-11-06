"use server";

import { cookies } from "next/headers";

import { Project } from "@repo/database";
import constants from "@repo/constants";
import { dayjs } from "@repo/utils";

export const changeProjectCookie = async (projectId: Project["id"]) => {
  cookies().set(constants.cookies.project, projectId, {
    httpOnly: true,
    expires: dayjs().add(1, "month").toDate(),
    path: "/",
  });
};
