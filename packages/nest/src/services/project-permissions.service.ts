import { queryPermissions } from "@repo/database";
import { ProjectPermissionsServiceBase } from "../types";

export class ProjectPermissionsService
  implements ProjectPermissionsServiceBase
{
  getProjectPermissions: ProjectPermissionsServiceBase["getProjectPermissions"] =
    (projectId) => {
      return queryPermissions({ projectId });
    };
}
