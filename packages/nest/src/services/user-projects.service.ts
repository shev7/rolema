import { queryProjectsCount, queryProjects } from "@repo/database";

import { MailService } from "./mail.service";
import { UserProjectsServiceBase } from "../types";

export class UserProjectsService implements UserProjectsServiceBase {
  constructor(protected readonly mailService: MailService) {}

  getProjects: UserProjectsServiceBase["getProjects"] = (props) => {
    return queryProjects(props);
  };

  getProjectsCount: UserProjectsServiceBase["getProjectsCount"] = (ownerId) => {
    return queryProjectsCount({ ownerId });
  };
}
