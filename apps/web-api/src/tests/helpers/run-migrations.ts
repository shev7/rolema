export const testRunMigrations = async (
  migrations: readonly (() => unknown)[],
) => {
  for (const migration of migrations) {
    await migration();
  }
};
