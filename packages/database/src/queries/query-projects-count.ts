import { count, eq } from "drizzle-orm";

import { db } from "../db";
import { Project } from "../types";

export type QueryProjectsCountProps = {
  ownerId?: Project["owner_id"];
};
export type QueryProjectsCountReturnType = Awaited<
  ReturnType<typeof queryProjectsCount>
>;

export const queryProjectsCount = async (props?: QueryProjectsCountProps) => {
  const [data] = await db.db
    .select({
      count: count(),
    })
    .from(db.schema.project)
    .where(
      props?.ownerId
        ? eq(db.schema.project.owner_id, props.ownerId)
        : undefined,
    );

  return data!;
};
