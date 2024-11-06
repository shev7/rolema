import { eq } from "drizzle-orm";

import { db } from "../db";
import { Permission } from "../types";

export type UpdatePermissionsProps = {
  updatedBy: Permission["updated_by"];
  delete:
    | {
        permissionProjectRoleId: NonNullable<
          Permission["permission_project_role_id"]
        >;
      }
    | {
        projectId: NonNullable<Permission["project_id"]>;
      };
  create: Array<
    | {
        permission_project_role_id: NonNullable<
          Permission["permission_project_role_id"]
        >;
        project_id: NonNullable<Permission["project_id"]>;
        key: Permission["key"];
      }
    | {
        permission_project_role_id: NonNullable<
          Permission["permission_project_role_id"]
        >;
        project_role_id: NonNullable<Permission["project_role_id"]>;
        key: Permission["key"];
      }
  >;
};

export type UpdatePermissionsReturnType = Awaited<
  ReturnType<typeof updatePermissions>
>;

export const updatePermissions = (props: UpdatePermissionsProps) => {
  return db.db.transaction(async (tx) => {
    const where = [];

    if ("permissionProjectRoleId" in props.delete) {
      where.push(
        eq(
          db.schema.permission.permission_project_role_id,
          props.delete.permissionProjectRoleId,
        ),
      );
    } else {
      where.push(eq(db.schema.permission.project_id, props.delete.projectId));
    }

    await tx.delete(db.schema.permission).where(where[0]);

    const values = await Promise.all(
      props.create.map<
        Promise<Omit<Permission, "id" | "created_at" | "updated_at">>
      >(async (data) => ({
        permission_project_role_id: data.permission_project_role_id,
        created_by: props.updatedBy,
        updated_by: props.updatedBy,
        key: data.key,
        project_id: "project_id" in data ? data.project_id : null,
        project_role_id:
          "project_role_id" in data ? data.project_role_id : null,
      })),
    );

    if (values.length > 0) {
      return tx.insert(db.schema.permission).values(values).returning();
    }

    return [];
  });
};
