import { queryProjectUsers, queryProjectUsersCount } from "@repo/database";
import { ProjectUsersServiceBase } from "../types";

export class ProjectUsersService implements ProjectUsersServiceBase {
  getProjectUsers: ProjectUsersServiceBase["getProjectUsers"] = (props) => {
    return queryProjectUsers(props);
  };

  getProjectUsersCount: ProjectUsersServiceBase["getProjectUsersCount"] = (
    props,
  ) => {
    return queryProjectUsersCount(props);
  };
}
