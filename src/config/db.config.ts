import { Pool } from 'pg';
import { environments } from './enviroment.js';

export const pool = new Pool({
  user: environments.DB_USER,
  password: environments.DB_PASSWORD,
  host: environments.DB_HOST,
  database: environments.DB_NAME,
  port: environments.DB_PORT,
  max: 30,
});
