import { QueryTiersReturnType } from "@repo/database";
import constants from "@repo/constants";

import { adminAPI } from "@api/admin";
import { Content } from "./components";
import { queryUsers } from "@utils/queries";

export const CreateProjectPage = async () => {
  const [users, tiers] = await Promise.all([
    queryUsers(
      new URLSearchParams({
        [constants.nav.sp.keys.excludeUserRole]: "admin",
      }),
    ),
    adminAPI.get<QueryTiersReturnType>("/tiers", {
      cache: "no-cache",
    }),
  ]);

  return <Content users={users} tiers={tiers} />;
};
