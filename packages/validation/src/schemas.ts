import { z } from "zod";

import constants from "@repo/constants";
import { Sort } from "@repo/types";

import { isStartDateBeforeEndDate, noLeadingOrTrailingSpace } from "./helpers";
import isEmpty from "lodash.isempty";

export const userSchema = z.object({
  id: z.string().length(constants.database.user.id.length),
  email: z.string().email().max(constants.database.user.email.maxLength),
  role: z.enum(constants.database.user.user_role),
});

export const loginSchema = z.object({
  email: userSchema.shape.email,
  password: z.string().min(constants.credentials.password.minLength),
});

export const registerSchema = z.object({
  token: z
    .string()
    .length(constants.database.user_email_verification.token.length),
  password: z.string().min(constants.credentials.password.minLength),
});

export const projectSchema = z.object({
  id: z.string().length(constants.database.project.id.length),
  name: z
    .string()
    .min(constants.database.project.name.minLength)
    .max(constants.database.project.name.maxLength)
    .refine(noLeadingOrTrailingSpace, {
      message: "Name must not have leading or trailing space",
    }),
  description: z
    .string()
    .min(constants.database.project.description.minLength)
    .max(constants.database.project.description.maxLength)
    .refine(noLeadingOrTrailingSpace, {
      message: "Description must not have leading or trailing space",
    }),
  owner_id: userSchema.shape.id,
  status: z.enum(constants.database.project.project_status),
  created_at: z.date(),
  updated_at: z.date(),
});

export const tierSchema = z.object({
  id: z.string().length(constants.database.tier.id.length),
  name: z
    .string()
    .min(constants.database.tier.name.minLength)
    .max(constants.database.tier.name.maxLength),
  description: z
    .string()
    .min(constants.database.tier.description.minLength)
    .max(constants.database.tier.description.maxLength),
  projects_count: z.number().min(constants.database.tier.projects_count.min),
  users_per_project_count: z
    .number()
    .min(constants.database.tier.users_per_project_count.min),
  roles_per_project_count: z
    .number()
    .min(constants.database.tier.roles_per_project_count.min),
  benefits: z.array(
    z
      .string()
      .min(constants.database.tier.benefits.minLength)
      .max(constants.database.tier.benefits.maxLength),
  ),
  price_per_month_monthly: z.array(
    z.object({
      currency: z.enum(["USD", "EUR", "BYN"]),
      amountCents: z.number().min(0.0),
    }),
  ),
  price_per_month_annually: z.array(
    z.object({
      currency: z.enum(["USD", "EUR", "BYN"]),
      amountCents: z.number().min(0.0),
    }),
  ),
  created_by: userSchema.shape.id,
  updated_by: userSchema.shape.id,
  created_at: z.date(),
  updated_at: z.date(),
});

export const projectTierSchema = z.object({
  project_id: projectSchema.shape.id,
  tier_id: tierSchema.shape.id,
  ends_at: z.date(),
  created_by: userSchema.shape.id,
  updated_by: userSchema.shape.id,
  created_at: z.date(),
  updated_at: z.date(),
});

export const createProjectSchema = z.object({
  project: projectSchema.pick({
    name: true,
    description: true,
    owner_id: true,
  }),
  project_tier: projectTierSchema
    .pick({
      tier_id: true,
    })
    .extend({
      duration: z.enum(constants.database.tier.day_durations),
    }),
});

export const updateProjectSchema = z.object({
  project: projectSchema.pick({ name: true, description: true }),
});

export const updateProjectStatusSchema = z.object({
  status: projectSchema.shape.status.exclude(["pending"]),
});

export const updateUserStatusSchema = z.object({
  status: z.enum(constants.database.user.user_status),
});

export const inviteUserSchema = z.object({
  email: userSchema.shape.email,
  project: projectSchema.pick({
    name: true,
    description: true,
  }),
  project_tier: projectTierSchema
    .pick({
      tier_id: true,
    })
    .extend({
      duration: z.enum(constants.database.tier.day_durations),
    }),
});

export const inviteUserToProjectSchema = z.object({
  email: z.string().email().max(constants.database.user.email.maxLength),
  project_id: z.string().length(constants.database.project.id.length),
  project_role_id: z.string().length(constants.database.project_role.id.length),
});

const projectRoleIdSchema = z
  .string()
  .length(constants.database.project_role.id.length);

export const projectRoleSchema = z.object({
  id: projectRoleIdSchema,
  project_id: projectSchema.shape.id,
  name: z
    .string()
    .min(constants.database.project_role.name.minLength)
    .max(constants.database.project_role.name.maxLength)
    .refine(noLeadingOrTrailingSpace, {
      message: "Name must not have leading or trailing space",
    }),
  created_by: userSchema.shape.id,
  created_at: z.date(),
  updated_at: z.date(),
});

export const permissionSchema = z.object({
  id: z.string().length(constants.database.permission.id.length),
  key: z.enum(constants.database.permission.keys),
  permission_project_role_id: projectRoleSchema.shape.id.optional(),
  project_id: projectSchema.shape.id.optional(),
  project_role_id: projectRoleSchema.shape.id.optional(),
  created_by: userSchema.shape.id,
  updated_by: userSchema.shape.id,
  created_at: z.date(),
  updated_at: z.date(),
});

export const permissionsSchema = z
  .array(
    z.union([
      permissionSchema.pick({ key: true }).extend({
        project_id: projectSchema.shape.id,
      }),
      permissionSchema.pick({ key: true }).extend({
        project_role_id: projectRoleSchema.shape.id,
      }),
    ]),
  )
  .refine(
    (permissions) => {
      const keys = new Set<string>();

      for (const permission of permissions) {
        const key = `${permission.key}${"project_id" in permission ? permission.project_id : ""}${"project_role_id" in permission ? permission.project_role_id : ""}`;

        if (keys.has(key)) {
          return false;
        }

        keys.add(key);
      }

      return true;
    },
    {
      message: "permissions must be unique",
    },
  )
  .refine(
    (permissions) => {
      const keys = new Set<string>(permissions.map(({ key }) => key));

      for (const key of keys) {
        const filteredPermissions = permissions.filter((x) => x.key === key);

        if (filteredPermissions.length === 1) continue;

        return !filteredPermissions.find((x) => "project_id" in x);
      }

      return true;
    },
    {
      message: "permissions must unique per key",
    },
  );

export const projectUserSchema = z.object({
  id: z.string().length(constants.database.project_user.id.length),
  project_id: projectSchema.shape.id,
  user_id: userSchema.shape.id,
  project_role_id: projectRoleSchema.shape.id,
  updated_by: userSchema.shape.id,
  status: z.enum(constants.database.project_user.status),
  created_at: z.date(),
  updated_at: z.date(),
});

export const createProjectRoleSchema = projectRoleSchema.pick({
  name: true,
  project_id: true,
});

export const updateProjectRoleSchema = projectRoleSchema.pick({
  name: true,
});

export const deleteUserSchema = userSchema.pick({
  id: true,
});

export const queryUsersSchema = z.object({
  roles: z.array(userSchema.shape.role),
  excludeRoles: z.array(userSchema.shape.role),
  sort: z.array(
    z.enum<Sort, [Sort, ...Array<Sort>]>(
      Object.values(constants.nav.sp.sort) as [Sort, ...Array<Sort>],
    ),
  ),
});

export const updateProjectUserSchema = z.object({
  project_role_id: projectRoleSchema.shape.id,
});

export const updateProjectUserStatusSchema = projectUserSchema.pick({
  status: true,
});

export const limitSchema = z.object({
  limit: z.coerce
    .number()
    .or(z.string().regex(/\d+/).transform(Number))
    .refine(
      (value) =>
        typeof value === "number" &&
        value >= constants.nav.sp.limit.min &&
        value <= constants.nav.sp.limit.max,
    ),
});

export const queryProjectUsersSchema = z.object({
  excludeProjectRoleIds: z
    .array(projectUserSchema.shape.project_role_id)
    .optional(),
});

export const deleteProjectRoleSchema = z.object({
  fallback_role_id: projectRoleSchema.shape.id,
});

export const updateTierSchema = tierSchema.pick({
  name: true,
  description: true,
  benefits: true,
});

export const updateProjectRolePermissionsSchema = z.object({
  permissions: permissionsSchema,
});

export const eventSchema = z
  .object({
    id: z.string().max(constants.database.event.id.length),
    title: z
      .string()
      .min(constants.database.event.title.minLength)
      .max(constants.database.event.title.maxLength),
    cron: z.string().nullable().optional(),
    start_date: z.coerce.date(),
    end_date: z.coerce.date(),
    created_by: userSchema.shape.id,
    updated_by: userSchema.shape.id,
    created_at: z.date(),
    updated_at: z.date(),
  })
  .refine(isStartDateBeforeEndDate, {
    message: "start date must go before end date",
    path: ["start_date", "end_date"],
  });

export const eventParticipantSchema = z.object({
  id: z.string().length(constants.database.event_participant.id.length),
  event_id: eventSchema._def.schema.shape.id,
  project_user_id: projectUserSchema.shape.id,
  created_by: userSchema.shape.id,
  updated_by: userSchema.shape.id,
  created_at: z.date(),
  updated_at: z.date(),
});

export const dateRangeSchema = z
  .object({
    start_date: z.coerce.date(),
    end_date: z.coerce.date(),
  })
  .refine(isStartDateBeforeEndDate, {
    message: "start date must go before end date",
    path: ["start_date", "end_date"],
  });

export const createProjectUserEventSchema = eventSchema._def.schema
  .pick({
    title: true,
    cron: true,
    start_date: true,
    end_date: true,
  })
  .extend({
    participants: z.array(projectUserSchema.shape.id),
  })
  .refine(isStartDateBeforeEndDate, {
    message: "start date must go before end date",
    path: ["start_date", "end_date"],
  });

export const updateProjectUserEventSchema = eventSchema._def.schema
  .pick({
    title: true,
    cron: true,
    start_date: true,
    end_date: true,
  })
  .partial()
  .refine((fields) => !isEmpty(fields), {
    message: "update body should not be empty",
  })
  .refine(isStartDateBeforeEndDate, {
    message: "start date must go before end date",
    path: ["start_date", "end_date"],
  });

export const updateProjectUserEventParticipantsSchema = z
  .array(projectUserSchema.shape.id)
  .min(1);
