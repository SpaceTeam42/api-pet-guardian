import 'dotenv/config';

import { z as zod } from 'zod';

import { fromZodError } from 'zod-validation-error';

const envSchema = zod.object({
  NODE_ENV: zod
    .enum(['development', 'test', 'production'])
    .default('production'),
  DATABASE_NAME: zod.string(),
  POSTGRES_PORT: zod.coerce.number(),
  POSTGRES_USERNAME: zod.string(),
  POSTGRES_PASSWORD: zod.string(),
  MONGO_PORT: zod.coerce.number(),
  MONGO_USERNAME: zod.string(),
  MONGO_PASSWORD: zod.string(),
  PORT: zod.coerce.number().default(3333),
  JWT_PRIVATE_KEY: zod.string(),
  JWT_PUBLIC_KEY: zod.string(),
  STORAGE_DRIVER: zod.enum(['disk', 's3']).default('disk'),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error('Invalid environment variables!', _env.error.format());

  const messageError = {
    message: 'Invalid environment variables!',
    error: fromZodError(_env.error),
  };

  throw new Error(JSON.stringify(messageError, null, 2));
}

export const env = _env.data;
