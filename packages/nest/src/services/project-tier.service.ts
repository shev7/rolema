import { queryProjectTier } from "@repo/database";

import { NotFoundException } from "@nestjs/common";

import { ProjectTierServiceBase } from "../types";

export class ProjectTierService implements ProjectTierServiceBase {
  getProjectTier: ProjectTierServiceBase["getProjectTier"] = async (props) => {
    const projectTier = await queryProjectTier(props);

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
}
