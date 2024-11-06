import constants from "@repo/constants";

type Key = (typeof constants.database.permission.keys)[number];

export const getPermissionValues = <T extends { key: Key }>(
  permissions: Array<T>,
  key: Key,
) => permissions.filter((permission) => permission.key === key);
