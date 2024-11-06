import { adminAPI } from "@api/admin";

import { UsersServiceBase } from "@repo/nest";

export const queryUsers = (searchParamsProp?: URLSearchParams) => {
  const searchParams = searchParamsProp?.toString();
  return adminAPI.get<Awaited<ReturnType<UsersServiceBase["getUsers"]>>>(
    `/users${searchParams ? `?${searchParams}` : ""}`,
    {
      cache: "no-cache",
    },
  );
};
