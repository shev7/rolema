/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");

const PACKAGES_DIR = "./packages";
const PACKAGE_FILE = "package.json";

const getDirectories = (source) => {
  return fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
};

const runNpmBuild = async (dirPath) => {
  return new Promise((resolve, reject) => {
    exec("npm run build", { cwd: dirPath }, (error, stdout, stderr) => {
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);

      if (error) {
        console.error(`Error building in ${dirPath}: ${error}`);

        return reject(error);
      }

      console.log(`${dirPath} is built successfully`);

      resolve();
    });
  });
};

const buildDirectory = async (dirName) => {
  const data = fs.readFileSync(path.join(PACKAGES_DIR, dirName, PACKAGE_FILE));

  if (JSON.parse(data).scripts?.build) {
    await runNpmBuild(path.join(PACKAGES_DIR, dirName));
  }
};

const buildPackages = async () => {
  const priorities = [
    ["constants"],
    ["types"],
    ["utils"],
    ["validation"],
    ["database"],
  ];

  const otherDirectories = getDirectories(PACKAGES_DIR).filter(
    (dir) => !priorities.find((packages) => packages.includes(dir)),
  );

  for await (const packages of priorities) {
    await Promise.all(packages.map(buildDirectory));
  }

  await Promise.all(otherDirectories.map(buildDirectory));
};

buildPackages();
