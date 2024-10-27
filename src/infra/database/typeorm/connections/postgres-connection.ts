import { DataSource } from 'typeorm';

import { env } from '@infra/env';

const postgresDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: env.POSTGRES_PORT,
  username: env.POSTGRES_USERNAME,
  password: env.POSTGRES_PASSWORD,
  database: env.DATABASE_NAME,
  // schema: 'public',
  entities: ['../entities/*.ts'],
  migrations: ['../migrations/*.ts'],
  // migrations: ['./src/infra/database/typeorm/migrations/*.ts'],
});

postgresDataSource
  .initialize()
  .then(() => console.log('🚀 Postgres database is connected'))
  .catch((err) => console.log(err));

export { postgresDataSource };
