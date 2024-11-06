import { eq, inArray } from "drizzle-orm";

import { db } from "../db";
import { Project } from "../types";

export type DeleteProjectsByOwnerIdProps = {
  ownerId: Project["owner_id"];
};
export type DeleteProjectsByOwnerIdReturnType = Awaited<
  ReturnType<typeof deleteProjectsByOwnerId>
>;

export const deleteProjectsByOwnerId = async ({
  ownerId,
}: DeleteProjectsByOwnerIdProps) => {
  return db.db.transaction(async (tx) => {
    const projects = await tx
      .select({
        id: db.schema.project.id,
      })
      .from(db.schema.project)
      .where(eq(db.schema.project.owner_id, ownerId));

    await tx.delete(db.schema.project_tier).where(
      inArray(
        db.schema.project_tier.project_id,
        projects.map(({ id }) => id),
      ),
    );

    const data = await tx
      .delete(db.schema.project)
      .where(eq(db.schema.project.owner_id, ownerId))
      .returning();

    return data;
  });
};
