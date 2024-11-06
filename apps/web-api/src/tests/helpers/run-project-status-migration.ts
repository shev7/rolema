import { Project } from "@repo/database";
import { testRunMigrations } from "./run-migrations";
import { testMigrations } from "../migrations";

export const testRunProjectStatusMigration = (status: Project["status"]) => {
  return testRunMigrations([
    testMigrations[
      `project0To${(status.charAt(0).toUpperCase() + status.slice(1)) as Capitalize<Project["status"]>}`
    ],
  ]);
};
