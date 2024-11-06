import {
  queryUsersStatistics,
  queryProjectsStatistics,
  queryTiersStatistics,
} from "@utils/queries";

import { Content } from "./components";

export const HomePage = async () => {
  const [usersStatistic, projectsStatistic, projectsPerTierStatistic] =
    await Promise.all([
      queryUsersStatistics(),
      queryProjectsStatistics(),
      queryTiersStatistics(),
    ]);

  return (
    <Content
      usersStatistic={usersStatistic}
      projectsStatistics={projectsStatistic}
      projectsPerTierStatistic={projectsPerTierStatistic}
    />
  );
};
