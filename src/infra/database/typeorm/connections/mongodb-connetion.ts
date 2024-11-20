import { DataSource } from 'typeorm';

import { env } from '@infra/env';

const mongoDataSource = new DataSource({
  type: 'mongodb',
  host: 'localhost',
  port: env.MONGO_PORT,
  database: env.DATABASE_NAME,
  useUnifiedTopology: true,
  entities: ['./src/infra/database/typeorm/schemas/*.ts'],
});

mongoDataSource
  .initialize()
  .then(() => console.log('🚀 Mongo database is connected'))
  .catch((err) => console.log(err));

export { mongoDataSource };
