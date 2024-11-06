import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { DatabaseError } from "pg";

import {
  createProject,
  queryProjects,
  queryProjectsCountGroupedByStatus,
  queryUserEmailVerifiedAndVerificationTokenById,
} from "@repo/database";
import constants from "@repo/constants";
import { dayjs } from "@repo/utils";

import { ProjectsServiceBase } from "../types";

export class ProjectsService implements ProjectsServiceBase {
  getProjects: ProjectsServiceBase["getProjects"] = (props) => {
    return queryProjects(props);
  };

  createProject: ProjectsServiceBase["createProject"] = async ({
    project: { name, description, owner_id },
    project_tier: { tier_id, duration },
    createdBy,
  }) => {
    try {
      const userData =
        await queryUserEmailVerifiedAndVerificationTokenById(owner_id);

      if (!userData) {
        throw new NotFoundException("Owner is not found.");
      }

      if (userData.user.role === "admin") {
        throw new ConflictException("Cannot create project for admin user");
      }

      const data = await createProject({
        name,
        description,
        owner_id,
        tier_id,
        ends_at: dayjs().add(Number(duration), "days").endOf("day").toDate(),
        created_by: createdBy,
        status: userData.email_verified ? "ready" : "pending",
      });

      if (!data) {
        throw new InternalServerErrorException();
      }

      return data.project;
    } catch (error) {
      if (error instanceof DatabaseError) {
        if (
          error.constraint === constants.database.project.name.uniqueConstraint
        ) {
          throw new ConflictException("Project with this name already exists.");
        }

        if (
          error.constraint ===
          constants.database.project.owner_id.foreignKeyConstraint
        ) {
          throw new NotFoundException("Owner not found.");
        }
      }

      throw error;
    }
  };

  getStatistics: ProjectsServiceBase["getStatistics"] = async () => {
    const data = await queryProjectsCountGroupedByStatus();

    return {
      total: data.reduce((total, { count }) => total + count, 0),
      project_statistics: data,
    };
  };
}
