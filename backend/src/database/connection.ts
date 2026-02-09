import pg from "pg";
import { dbConfig } from "../config/dbConfig.js";

export const traceRoutePool = new pg.Pool({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database
});
