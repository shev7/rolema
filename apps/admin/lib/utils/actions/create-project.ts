"use server";

import { redirect } from "next/navigation";

import { CreateProjectSchema } from "@repo/validation";
import constants from "@repo/constants";
import { ProjectsServiceBase } from "@repo/nest";

import { adminAPI } from "@api/admin";

export const createProject = async (values: CreateProjectSchema) => {
  const project = await adminAPI.post<
    Awaited<ReturnType<ProjectsServiceBase["createProject"]>>
  >(`/projects`, values);

  redirect(constants.nav.routes.project(project.id));
};
