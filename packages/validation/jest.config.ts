import type { Config } from "jest";

export default {
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "../coverage",
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "src",
  testEnvironment: "node",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  moduleNameMapper: {
    "^@tests/(.*)$": "<rootDir>/tests/$1",
  },
  modulePaths: ["<rootDir>"],
} satisfies Config;
