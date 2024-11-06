"use server";

import { UpdateTierSchema } from "@repo/validation";
import { ProjectsServiceBase } from "@repo/nest";

import { adminAPI } from "@api/admin";
import { Tier } from "@repo/database";

export const updateTier = ({
  id,
  ...values
}: UpdateTierSchema & { id: Tier["id"] }) => {
  return adminAPI.patch<
    Awaited<ReturnType<ProjectsServiceBase["createProject"]>>
  >(`/tiers/${id}`, values);
};
