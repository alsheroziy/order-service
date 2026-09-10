import pg, { Pool } from 'pg';
import { environments } from './enviroment.js';

pg.types.setTypeParser(1700, (val: string) => parseFloat(val));

export const pool = new Pool({
  user: environments.DB_USER,
  password: environments.DB_PASSWORD,
  host: environments.DB_HOST,
  database: environments.DB_NAME,
  port: environments.DB_PORT,
  max: 30,
});
