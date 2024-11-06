import { queryProjects } from "@repo/database";

import { NotFoundException } from "@nestjs/common";

import { MailService } from "./mail.service";
import { UserProjectServiceBase } from "../types";

export class UserProjectService implements UserProjectServiceBase {
  constructor(protected readonly mailService: MailService) {}
  getUserProject: UserProjectServiceBase["getUserProject"] = async (props) => {
    const [project] = await queryProjects(props);

    if (!project) {
      throw new NotFoundException("User project is not found");
    }

    return project;
  };
}
