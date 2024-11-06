import { and, asc, desc, eq, inArray, notInArray } from "drizzle-orm";

import { Sort } from "@repo/types";
import constants from "@repo/constants";

import { db } from "../db";
import { User } from "../types";

export type QueryUsersProps = {
  roles?: Array<User["role"]>;
  excludeRoles?: Array<User["role"]>;
  sort?: Sort;
};
export type QueryUsersReturnType = Awaited<ReturnType<typeof queryUsers>>;

export const queryUsers = async ({
  roles,
  excludeRoles,
  sort,
}: QueryUsersProps = {}) => {
  const where = [];

  if (roles?.length) {
    where.push(inArray(db.schema.user.role, roles));
  }

  if (excludeRoles?.length) {
    where.push(notInArray(db.schema.user.role, excludeRoles));
  }

  let orderBy = desc(db.schema.user.created_at);

  if (sort === constants.nav.sp.sort.userRoleAsc) {
    orderBy = asc(db.schema.user.role);
  } else if (sort === constants.nav.sp.sort.userRoleDesc) {
    orderBy = desc(db.schema.user.role);
  }

  const users = await db.db
    .select({
      id: db.schema.user.id,
      email: db.schema.user.email,
      role: db.schema.user.role,
      status: db.schema.user.status,
      created_at: db.schema.user.created_at,
      updated_at: db.schema.user.updated_at,
      email_verified: db.schema.user_info.email_verified,
      email_verified_at: db.schema.user_info.email_verified_at,
    })
    .from(db.schema.user)
    .leftJoin(
      db.schema.user_info,
      eq(db.schema.user_info.user_id, db.schema.user.id),
    )
    .where(where.length ? and(...where) : where[0])
    .orderBy(orderBy);

  return users.map(
    ({
      id,
      email,
      role,
      status,
      created_at,
      updated_at,
      email_verified,
      email_verified_at,
    }) => ({
      id: id!,
      email: email!,
      role: role!,
      status: status!,
      created_at: created_at!,
      updated_at: updated_at!,
      email_verified: email_verified!,
      email_verified_at,
    }),
  );
};
