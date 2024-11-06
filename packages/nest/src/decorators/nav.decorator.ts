import { Param, Query } from "@nestjs/common";

import constants from "@repo/constants";
import {
  eventSchema,
  limitSchema,
  projectRoleSchema,
  projectSchema,
  dateRangeSchema,
  queryProjectUsersSchema,
  queryUsersSchema,
  tierSchema,
  userSchema,
} from "@repo/validation";

import { ZodPipe } from "../pipes";
import { getSearchParam } from "@repo/utils";

export const ProjectIdParam = () => {
  return Param(
    constants.nav.sp.keys.projectId,
    new ZodPipe(projectSchema.shape.id),
  );
};

export const UserIdParam = () => {
  return Param(constants.nav.sp.keys.userId, new ZodPipe(userSchema.shape.id));
};

export const ProjectRoleIdParam = () => {
  return Param(
    constants.nav.sp.keys.projectRoleId,
    new ZodPipe(projectRoleSchema.shape.id),
  );
};

export const TierIdParam = () => {
  return Param(constants.nav.sp.keys.tierId, new ZodPipe(tierSchema.shape.id));
};

export const UserRolesQuery = () => {
  return Query(
    constants.nav.sp.keys.userRole,
    new ZodPipe<undefined | string | string[]>(
      queryUsersSchema.shape.roles,
      (param) =>
        getSearchParam(
          {
            param,
          },
          "param",
        ),
    ),
  );
};

export const ExcludeProjectRoleIdsQuery = () => {
  return Query(
    constants.nav.sp.keys.excludeProjectRoleId,
    new ZodPipe<undefined | string | string[]>(
      queryProjectUsersSchema.shape.excludeProjectRoleIds,
      (param) => getSearchParam({ param }, "param"),
    ),
  );
};

export const ProjectRoleIdOptionalQuery = () => {
  return Query(
    constants.nav.sp.keys.projectRoleId,
    new ZodPipe(projectRoleSchema.shape.id.optional()),
  );
};

export const ExcludeUserRolesQuery = () => {
  return Query(
    constants.nav.sp.keys.excludeUserRole,
    new ZodPipe<undefined | string | string[]>(
      queryUsersSchema.shape.excludeRoles,
      (param) =>
        getSearchParam(
          {
            param,
          },
          "param",
        ),
    ),
  );
};

export const FallbackRoleIdOptionalQuery = () => {
  return Query(
    constants.nav.sp.keys.fallbackRoleId,
    new ZodPipe(projectRoleSchema.shape.id.optional()),
  );
};

export const LimitOptionalQuery = () => {
  return Query(
    constants.nav.sp.limit.name,
    new ZodPipe(limitSchema.shape.limit.optional()),
  );
};

export const UsersSortQuery = () => {
  return Query(
    constants.nav.sp.keys.usersSort,
    new ZodPipe<undefined | string | string[]>(
      queryUsersSchema.shape.sort,
      (param) =>
        getSearchParam(
          {
            param,
          },
          "param",
        ),
    ),
  );
};

export const DateRangeQuery = () => {
  return Query(new ZodPipe(dateRangeSchema));
};

export const EventIdParam = () => {
  return Param(
    constants.nav.sp.keys.eventId,
    new ZodPipe(eventSchema._def.schema.shape.id),
  );
};
