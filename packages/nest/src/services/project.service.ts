import { ConflictException, NotFoundException } from "@nestjs/common";
import { DatabaseError } from "pg";

import {
  updateProject,
  deleteProject,
  queryProjectById,
  updateProjectStatus,
  queryProjectTier,
  queryProjectStatistics,
} from "@repo/database";
import constants from "@repo/constants";

import { ProjectServiceBase } from "../types";

export class ProjectService implements ProjectServiceBase {
  updateProject: ProjectServiceBase["updateProject"] = async ({
    projectId,
    updatedBy,
    project: { name, description },
    statuses,
  }) => {
    try {
      const project = await updateProject({
        id: projectId,
        updatedBy,
        name,
        description,
        statuses,
      });

      if (!project) {
        throw new NotFoundException("Project is not found.");
      }

      return project;
    } catch (error) {
      if (
        error instanceof DatabaseError &&
        error.constraint === constants.database.project.name.uniqueConstraint
      ) {
        throw new ConflictException("Project with this name already exists.");
      }

      throw error;
    }
  };

  deleteProject: ProjectServiceBase["deleteProject"] = async (projectId) => {
    const project = await deleteProject(projectId);

    if (!project) {
      throw new NotFoundException("Project is not found.");
    }

    return project;
  };

  getProject: ProjectServiceBase["getProject"] = async (props) => {
    const project = await queryProjectById(props);

    if (!project) {
      throw new NotFoundException("Project is not found.");
    }

    return project;
  };

  updateProjectStatus: ProjectServiceBase["updateProjectStatus"] = async ({
    projectId,
    status,
    updatedBy,
  }) => {
    const project = await updateProjectStatus({
      id: projectId,
      status,
      updatedBy,
    });

    if (!project) {
      throw new NotFoundException("Project is not found.");
    }

    return project;
  };

  getProjectTier: ProjectServiceBase["getProjectTier"] = async (projectId) => {
    const projectTier = await queryProjectTier({ projectId });

    if (!projectTier) {
      throw new NotFoundException("project tier is not found");
    } else if (!projectTier.tier) {
      throw new NotFoundException("tier is not found");
    }

    return {
      tier: projectTier.tier,
      project_tier: projectTier.project_tier,
    };
  };

  getProjectStatistics: ProjectServiceBase["getProjectStatistics"] = async (
    projectId: string,
  ) => {
    const data = await queryProjectStatistics(projectId);

    if (!data) {
      throw new NotFoundException("project is not found");
    } else if (!data.project_tier) {
      throw new NotFoundException("project tier is not found");
    } else if (!data.tier) {
      throw new NotFoundException("tier is not found");
    }

    return {
      project: data.project,
      project_tier: data.project_tier,
      tier: data.tier,
      project_roles_count: data.project_roles_count,
      project_users: data.project_users,
    };
  };
}
