import pg from "pg";
import { environments } from "./enviroment.js";

const { Pool } = pg;

export const pool = new Pool({
  user: environments.DB_USER,
  password: environments.DB_PASSWORD,
  host: environments.DB_HOST,
  database: environments.DB_NAME,
  port: environments.DB_PORT,
});
