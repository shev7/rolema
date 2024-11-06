import { BadRequestException, NotFoundException } from "@nestjs/common";

import { queryProjectUsers, updateProjectUser } from "@repo/database";

import { ProjectUserServiceBase } from "../types";

export class ProjectUserService implements ProjectUserServiceBase {
  getProjectsUser: ProjectUserServiceBase["getProjectsUser"] = async (
    props,
  ) => {
    const [projectUser] = await queryProjectUsers(props);

    if (!projectUser) {
      throw new NotFoundException("Project user is not found.");
    }

    return projectUser;
  };

  deleteProjectUser: ProjectUserServiceBase["deleteProjectUser"] = async (
    props,
  ) => {
    const projectUser = await updateProjectUser({
      ...props,
      fields: {
        status: "deleted",
      },
    });

    if (!projectUser) {
      throw new NotFoundException("Project user is not found.");
    }

    return projectUser;
  };

  updateProjectUser: ProjectUserServiceBase["updateProjectUser"] = async (
    props,
  ) => {
    if (Object.keys(props.fields).length === 0) {
      throw new BadRequestException("No fields provided");
    }

    const projectUser = await updateProjectUser(props);

    if (!projectUser) {
      throw new NotFoundException("Project user is not found.");
    }

    return projectUser;
  };
}
