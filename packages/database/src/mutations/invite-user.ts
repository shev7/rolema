import { generateId } from "@repo/utils";
import constants from "@repo/constants";

import { db } from "../db";
import { Project, ProjectTier, ProjectUser, User } from "../types";

export type InviteUserProps = {
  userEmail: User["email"];
  invitedBy: User["id"];
} & (
  | {
      role: "general";
      projectUser: Pick<ProjectUser, "project_id" | "project_role_id">;
    }
  | {
      role: "creator";
      project: Pick<Project, "name" | "description">;
      projectTier: Pick<ProjectTier, "tier_id" | "ends_at">;
    }
);

export type InviteUserReturnType = Awaited<ReturnType<typeof inviteUser>>;

export const inviteUser = ({
  userEmail,
  role,
  invitedBy,
  ...props
}: InviteUserProps) => {
  return db.db.transaction(async (tx) => {
    const [id, projectId, token] = await Promise.all([
      generateId(constants.database.user.id.length),
      generateId(constants.database.project.id.length),
      generateId(constants.database.user_email_verification.token.length),
    ]);

    const [[user]] = await Promise.all([
      tx
        .insert(db.schema.user)
        .values({ id, email: userEmail, role, updated_by: invitedBy })
        .returning(),
      tx
        .insert(db.schema.user_info)
        .values({
          user_id: id,
          invited_by: invitedBy,
          updated_by: invitedBy,
          email_verified: false,
        })
        .returning(),
      tx
        .insert(db.schema.user_email_verification)
        .values({ user_email: userEmail, email_sent: false, token })
        .returning(),
    ]);

    if ("projectUser" in props) {
      await tx.insert(db.schema.project_user).values({
        project_id: props.projectUser.project_id,
        user_id: id,
        project_role_id: props.projectUser.project_role_id,
        updated_by: invitedBy,
      });
    }

    if ("project" in props) {
      await Promise.all([
        tx.insert(db.schema.project).values({
          id: projectId,
          name: props.project.name,
          description: props.project.description,
          owner_id: id,
          created_by: invitedBy,
          updated_by: invitedBy,
        }),
        tx.insert(db.schema.project_tier).values({
          project_id: projectId,
          tier_id: props.projectTier.tier_id,
          ends_at: props.projectTier.ends_at,
          created_by: invitedBy,
          updated_by: invitedBy,
        }),
      ]);
    }

    return { user, token };
  });
};
