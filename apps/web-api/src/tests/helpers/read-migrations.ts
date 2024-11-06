import fs from "fs";
import path from "path";

export const testReadMigrations = (): Promise<string[]> => {
  const migrationsDirectory = path.relative(
    "apps/web-api",
    "packages/database/drizzle",
  );

  return new Promise((resolve, reject) => {
    fs.readdir(migrationsDirectory, (err, files) => {
      if (err) {
        return reject(new Error("Unable to scan directory: " + err));
      }

      const sqlFiles = files
        .filter((file) => path.extname(file) === ".sql")
        .sort();

      const migrations = sqlFiles.reduce<string[]>((acc, file) => {
        const filePath = path.join(migrationsDirectory, file);
        const content = fs.readFileSync(filePath, "utf8");

        return [...acc, content];
      }, []);

      resolve(migrations);
    });
  });
};
