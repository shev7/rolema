export default {
  permission: {
    id: { length: 10 },
    keys: ["role:read", "role:invite"],
  },
  project: {
    description: {
      maxLength: 2000,
      minLength: 1,
    },
    id: {
      length: 4,
    },
    name: {
      maxLength: 255,
      minLength: 1,
      uniqueConstraint: "project_name_unique",
    },
    owner_id: {
      foreignKeyConstraint: "project_owner_id_user_id_fk",
    },
    project_status: ["ready", "pending", "paused", "deleted"],
  },
  project_role: {
    id: {
      length: 8,
    },
    name: {
      maxLength: 255,
      minLength: 1,
    },
    project_id: {
      foreignKeyConstraint: "project_role_project_id_project_id_fk",
    },
    projectUniqueRoleConstraint: "project_unique_role",
  },
  project_user: {
    id: {
      length: 8,
    },
    project_role_id: {
      foreignKeyConstraint: "project_user_project_role_id_project_role_id_fk",
    },
    projectUniqueUserConstraint: "project_unique_user",
    status: ["pending", "ready", "blocked", "deleted"],
  },
  tier: {
    description: {
      maxLength: 2000,
      minLength: 5,
    },
    day_durations: ["30", "60", "90", "120", "180", "270", "365"],
    id: {
      length: 2,
    },
    benefits: {
      minLength: 1,
      maxLength: 1000,
    },
    name: {
      maxLength: 255,
      minLength: 1,
      uniqueConstraint: "tier_name_unique",
    },
    projects_count: {
      min: 1,
    },
    roles_per_project_count: {
      min: 1,
    },
    users_per_project_count: {
      min: 1,
    },
  },
  user: {
    email: {
      maxLength: 200,
    },
    id: {
      length: 6,
    },
    user_role: ["admin", "creator", "general"],
    user_status: ["pending", "ready", "blocked", "deleted"],
  },
  user_email_verification: {
    token: {
      length: 32,
    },
  },
  user_info: {
    password_hash: {
      maxLength: 200,
    },
  },
  event: {
    id: {
      length: 12,
    },
    title: {
      minLength: 1,
      maxLength: 100,
    },
  },
  event_participant: {
    id: {
      length: 16,
    },
    eventUniqueProjectUserConstraint: "event_unique_project_user",
  },
} as const;
