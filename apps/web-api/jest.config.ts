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
    "^@guards/(.*)$": "<rootDir>/guards/$1",
    "^@tests/(.*)$": "<rootDir>/tests/$1",
    "^@modules/(.*)$": "<rootDir>/modules/$1",
  },
  modulePaths: ["<rootDir>"],
} satisfies Config;
