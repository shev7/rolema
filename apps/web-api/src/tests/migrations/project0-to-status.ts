import { Project, db } from "@repo/database";

export const project0ToStatus = (status: Project["status"]) => () => {
  return db.db.update(db.schema.project).set({ status });
};
