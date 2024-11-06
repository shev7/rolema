import { queryProjectUsers, queryProjectUsersCount } from "@repo/database";

import { ProjectsUserServiceBase } from "../types";

export class ProjectsUserService implements ProjectsUserServiceBase {
  getProjectUsers: ProjectsUserServiceBase["getProjectUsers"] = (props) => {
    return queryProjectUsers(props);
  };

  getProjectUsersCount: ProjectsUserServiceBase["getProjectUsersCount"] = (
    props,
  ) => {
    return queryProjectUsersCount(props);
  };
}
