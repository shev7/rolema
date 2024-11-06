import {
  pgTable,
  varchar,
  pgEnum,
  boolean,
  timestamp,
  unique,
  foreignKey,
  jsonb,
  integer,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import constants from "@repo/constants";
import { Currency } from "@repo/types";
import { generateId } from "./utils";

type UserRole = (typeof constants.database.user.user_role)[number];
type UserStatus = (typeof constants.database.user.user_status)[number];
type ProjectUserStatus =
  (typeof constants.database.project_user.status)[number];
type ProjectStatus = (typeof constants.database.project.project_status)[number];
type PermissionKey = (typeof constants.database.permission.keys)[number];

export const user_role = pgEnum<UserRole, Readonly<[UserRole, ...UserRole[]]>>(
  "user_role",
  constants.database.user.user_role,
);

export const user_status = pgEnum<
  UserStatus,
  Readonly<[UserStatus, ...UserStatus[]]>
>("user_status", constants.database.user.user_status);

export const project_user_status = pgEnum<
  ProjectUserStatus,
  Readonly<[ProjectUserStatus, ...ProjectUserStatus[]]>
>("project_user_status", constants.database.project_user.status);

export const project_status = pgEnum<
  ProjectStatus,
  Readonly<[ProjectStatus, ...ProjectStatus[]]>
>("project_status", constants.database.project.project_status);

export const permission_key = pgEnum<
  PermissionKey,
  Readonly<[PermissionKey, ...PermissionKey[]]>
>("permission_key", constants.database.permission.keys);

export const user = pgTable(
  "user",
  {
    id: varchar("id", {
      length: constants.database.user.id.length,
    })
      .primaryKey()
      .default(generateId(constants.database.user.id.length))
      .unique(),
    email: varchar("email", { length: constants.database.user.email.maxLength })
      .unique()
      .notNull(),
    role: user_role("role").notNull(),
    status: user_status("status").default("pending").notNull(),
    updated_by: varchar("updated_by", {
      length: constants.database.user.id.length,
    }).notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    parentReference: foreignKey({
      columns: [table.updated_by],
      foreignColumns: [table.id],
      name: "updated_by",
    }),
  }),
);

export const user_info = pgTable("user_info", {
  user_id: varchar("user_id", { length: constants.database.user.id.length })
    .references(() => user.id)
    .primaryKey(),
  invited_by: varchar("invited_by", {
    length: constants.database.user.id.length,
  })
    .references(() => user.id)
    .notNull(),
  email_verified: boolean("email_verified").default(false).notNull(),
  email_verified_at: timestamp("email_verified_at", { mode: "date" }),
  password_hash: varchar("password_hash", {
    length: constants.database.user_info.password_hash.maxLength,
  }),
  updated_by: varchar("updated_by", {
    length: constants.database.user.id.length,
  })
    .references(() => user.id)
    .notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const user_email_verification = pgTable("user_email_verification", {
  user_email: varchar("user_email", {
    length: constants.database.user.email.maxLength,
  })
    .references(() => user.email)
    .primaryKey(),
  token: varchar("token", {
    length: constants.database.user_email_verification.token.length,
  }).notNull(),
  email_sent: boolean("email_sent").notNull(),
});

export const project = pgTable("project", {
  id: varchar("id", {
    length: constants.database.project.id.length,
  })
    .primaryKey()
    .default(generateId(constants.database.project.id.length))
    .unique(),
  name: varchar("name", { length: constants.database.project.name.maxLength })
    .unique()
    .notNull(),
  description: varchar("description", {
    length: constants.database.project.description.maxLength,
  }).notNull(),
  owner_id: varchar("owner_id", {
    length: constants.database.user.id.length,
  })
    .references(() => user.id)
    .notNull(),
  created_by: varchar("created_by", {
    length: constants.database.user.id.length,
  })
    .references(() => user.id)
    .notNull(),
  updated_by: varchar("updated_by", {
    length: constants.database.user.id.length,
  })
    .references(() => user.id)
    .notNull(),
  status: project_status("status").default("pending").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const project_user = pgTable(
  "project_user",
  {
    id: varchar("id", {
      length: constants.database.project_user.id.length,
    })
      .primaryKey()
      .default(generateId(constants.database.project_user.id.length))
      .unique(),
    project_id: varchar("project_id", {
      length: constants.database.project.id.length,
    })
      .references(() => project.id)
      .notNull(),
    user_id: varchar("user_id", {
      length: constants.database.user.id.length,
    })
      .references(() => user.id)
      .notNull(),
    project_role_id: varchar("project_role_id", {
      length: constants.database.project_role.id.length,
    })
      .references(() => project_role.id)
      .notNull(),
    updated_by: varchar("updated_by", {
      length: constants.database.user.id.length,
    })
      .references(() => user.id)
      .notNull(),
    status: project_user_status("status").default("pending").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    project_unique_user: unique(
      constants.database.project_user.projectUniqueUserConstraint,
    ).on(table.project_id, table.user_id),
  }),
);

export const project_role = pgTable(
  "project_role",
  {
    id: varchar("id", {
      length: constants.database.project_role.id.length,
    })
      .primaryKey()
      .default(generateId(constants.database.project_role.id.length))
      .unique(),
    project_id: varchar("project_id", {
      length: constants.database.project.id.length,
    })
      .references(() => project.id)
      .notNull(),
    name: varchar("name", {
      length: constants.database.project_role.name.maxLength,
    }).notNull(),
    created_by: varchar("created_by", {
      length: constants.database.user.id.length,
    })
      .references(() => user.id)
      .notNull(),
    updated_by: varchar("updated_by", {
      length: constants.database.user.id.length,
    })
      .references(() => user.id)
      .notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    project_unique_role: unique(
      constants.database.project_role.projectUniqueRoleConstraint,
    ).on(table.project_id, table.name),
  }),
);

export const permission = pgTable("permission", {
  id: varchar("id", {
    length: constants.database.permission.id.length,
  })
    .primaryKey()
    .default(generateId(constants.database.permission.id.length))
    .unique(),
  key: permission_key("key").notNull(),
  permission_project_role_id: varchar("permission_project_role_id", {
    length: constants.database.project_role.id.length,
  }).references(() => project_role.id),
  project_id: varchar("project_id", {
    length: constants.database.project.id.length,
  }).references(() => project.id),
  project_role_id: varchar("project_role_id", {
    length: constants.database.project_role.id.length,
  }).references(() => project_role.id),
  created_by: varchar("created_by", {
    length: constants.database.user.id.length,
  })
    .references(() => user.id)
    .notNull(),
  updated_by: varchar("updated_by", {
    length: constants.database.user.id.length,
  })
    .references(() => user.id)
    .notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const tier = pgTable("tier", {
  id: varchar("id", {
    length: constants.database.tier.id.length,
  })
    .primaryKey()
    .default(generateId(constants.database.tier.id.length))
    .unique(),
  name: varchar("name", { length: constants.database.tier.name.maxLength })
    .unique()
    .notNull(),
  description: varchar("description", {
    length: constants.database.tier.description.maxLength,
  }).notNull(),
  projects_count: integer("projects_count").notNull(),
  users_per_project_count: integer("users_per_project_count").notNull(),
  roles_per_project_count: integer("roles_per_project_count").notNull(),
  benefits: varchar("benefits")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  price_per_month_monthly: jsonb("price_per_month_monthly")
    .notNull()
    .unique()
    .$type<
      Array<{
        currency: Currency;
        amountCents: number;
      }>
    >()
    .default([]),
  price_per_month_annually: jsonb("price_per_month_annually")
    .notNull()
    .unique()
    .$type<
      Array<{
        currency: Currency;
        amountCents: number;
      }>
    >()
    .default([]),
  created_by: varchar("created_by", {
    length: constants.database.user.id.length,
  })
    .references(() => user.id)
    .notNull(),
  updated_by: varchar("updated_by", {
    length: constants.database.user.id.length,
  })
    .references(() => user.id)
    .notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const project_tier = pgTable("project_tier", {
  project_id: varchar("project_id", {
    length: constants.database.project.id.length,
  })
    .references(() => project.id)
    .notNull()
    .unique(),
  tier_id: varchar("tier_id", {
    length: constants.database.tier.id.length,
  })
    .references(() => tier.id)
    .notNull(),
  ends_at: timestamp("ends_at").notNull(),
  created_by: varchar("created_by", {
    length: constants.database.user.id.length,
  })
    .references(() => user.id)
    .notNull(),
  updated_by: varchar("updated_by", {
    length: constants.database.user.id.length,
  })
    .references(() => user.id)
    .notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const event = pgTable("event", {
  id: varchar("id", {
    length: constants.database.event.id.length,
  })
    .primaryKey()
    .default(generateId(constants.database.event.id.length))
    .unique(),
  title: varchar("title", {
    length: constants.database.event.title.maxLength,
  }).notNull(),
  start_date: timestamp("start_date").notNull(),
  end_date: timestamp("end_date").notNull(),
  cron: varchar("cron"),
  created_by: varchar("created_by", {
    length: constants.database.user.id.length,
  })
    .references(() => user.id)
    .notNull(),
  updated_by: varchar("updated_by", {
    length: constants.database.user.id.length,
  })
    .references(() => user.id)
    .notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const event_participant = pgTable(
  "event_participant",
  {
    id: varchar("id", {
      length: constants.database.event_participant.id.length,
    })
      .primaryKey()
      .default(generateId(constants.database.event_participant.id.length))
      .unique(),
    event_id: varchar("event_id", {
      length: constants.database.event.id.length,
    })
      .references(() => event.id)
      .notNull(),
    project_user_id: varchar("project_user_id", {
      length: constants.database.project_user.id.length,
    })
      .references(() => project_user.id)
      .notNull(),
    created_by: varchar("created_by", {
      length: constants.database.user.id.length,
    })
      .references(() => user.id)
      .notNull(),
    updated_by: varchar("updated_by", {
      length: constants.database.user.id.length,
    })
      .references(() => user.id)
      .notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    event_unique_project_user: unique(
      constants.database.event_participant.eventUniqueProjectUserConstraint,
    ).on(table.event_id, table.project_user_id),
  }),
);
