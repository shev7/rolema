import { count } from "drizzle-orm";

import { db } from "../db";
import { Project } from "../types";

export type QueryProjectsCountGroupedByStatusReturnType = Awaited<
  ReturnType<typeof queryProjectsCountGroupedByStatus>
>;

export const queryProjectsCountGroupedByStatus = () => {
  return db.db
    .select({
      count: count(),
      status: db.schema.project.status,
    })
    .from(db.schema.project)
    .groupBy(db.schema.project.status) as Promise<
    Array<{
      count: number;
      status: Project["status"];
    }>
  >;
};
