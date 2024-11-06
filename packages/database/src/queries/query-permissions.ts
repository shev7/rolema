import { and, desc, eq, inArray, isNull } from "drizzle-orm";

import { db } from "../db";
import { Permission } from "../types";

export type QueryPermissionsProps = {
  keys?: Array<Permission["key"]>;
} & (
  | {
      permissionProjectRoleId: NonNullable<
        Permission["permission_project_role_id"]
      >;
    }
  | {
      projectId: NonNullable<Permission["project_id"]>;
    }
);

export type QueryPermissionsReturnType = Awaited<
  ReturnType<typeof queryPermissions>
>;

export const queryPermissions = async ({
  keys,
  ...props
}: QueryPermissionsProps) => {
  const where = [];

  if (keys?.length) {
    where.push(inArray(db.schema.permission.key, keys));
  }

  if ("permissionProjectRoleId" in props) {
    where.push(
      eq(
        db.schema.permission.permission_project_role_id,
        props.permissionProjectRoleId,
      ),
    );
  } else if ("projectId" in props) {
    where.push(eq(db.schema.permission.project_id, props.projectId));
  }

  return db.db
    .select()
    .from(db.schema.permission)
    .where(and(...where))
    .orderBy(desc(db.schema.permission.created_at));
};
