import database from "./database";
import credentials from "./credentials";
import config from "./config";
import cookies from "./cookies";
import nav from "./nav";
import common from "./common";

export default {
  config,
  cookies,
  credentials,
  database,
  nav,
  common,
} as const;
