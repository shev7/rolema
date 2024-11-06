import { z } from "zod";

import {
  loginSchema,
  createProjectSchema,
  registerSchema,
  inviteUserSchema,
  updateProjectSchema,
  inviteUserToProjectSchema,
  createProjectRoleSchema,
  updateProjectRoleSchema,
  updateProjectStatusSchema,
  updateUserStatusSchema,
  deleteUserSchema,
  updateProjectUserSchema,
  projectUserSchema,
  updateProjectUserStatusSchema,
  queryProjectUsersSchema,
  updateTierSchema,
  permissionsSchema,
  updateProjectRolePermissionsSchema,
  eventSchema,
  eventParticipantSchema,
  createProjectUserEventSchema,
  updateProjectUserEventSchema,
  dateRangeSchema,
  updateProjectUserEventParticipantsSchema,
} from "./schemas";

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type CreateProjectSchema = z.infer<typeof createProjectSchema>;
export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>;
export type UpdateProjectStatusSchema = z.infer<
  typeof updateProjectStatusSchema
>;
export type InviteUserSchema = z.infer<typeof inviteUserSchema>;
export type UpdateUserStatusSchema = z.infer<typeof updateUserStatusSchema>;
export type CreateProjectRoleSchema = z.infer<typeof createProjectRoleSchema>;
export type UpdateProjectRoleSchema = z.infer<typeof updateProjectRoleSchema>;
export type InviteUserToProjectSchema = z.infer<
  typeof inviteUserToProjectSchema
>;
export type DeleteUserSchema = z.infer<typeof deleteUserSchema>;
export type UpdateProjectUserSchema = z.infer<typeof updateProjectUserSchema>;
export type ProjectUserSchema = z.infer<typeof projectUserSchema>;
export type UpdateProjectUserStatusSchema = z.infer<
  typeof updateProjectUserStatusSchema
>;
export type QueryProjectUsersSchema = z.infer<typeof queryProjectUsersSchema>;
export type UpdateTierSchema = z.infer<typeof updateTierSchema>;
export type PermissionsSchema = z.infer<typeof permissionsSchema>;
export type UpdateProjectRolePermissionsSchema = z.infer<
  typeof updateProjectRolePermissionsSchema
>;
export type EventSchema = z.infer<typeof eventSchema>;
export type EventParticipantSchema = z.infer<typeof eventParticipantSchema>;
export type DateRangeSchema = z.infer<typeof dateRangeSchema>;
export type CreateProjectUserEventSchema = z.infer<
  typeof createProjectUserEventSchema
>;
export type UpdateProjectUserEventSchema = z.infer<
  typeof updateProjectUserEventSchema
>;
export type UpdateProjectUserEventParticipantsSchema = z.infer<
  typeof updateProjectUserEventParticipantsSchema
>;
