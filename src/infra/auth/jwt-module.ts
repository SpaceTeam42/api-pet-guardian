import { FastifyInstance } from 'fastify';

import fastifyJwt from '@fastify/jwt';

import { env } from '@infra/env';

export function jwtModule(app: FastifyInstance) {
  app.register(fastifyJwt, {
    secret: {
      private: Buffer.from(env.JWT_PRIVATE_KEY, 'base64'),
      public: Buffer.from(env.JWT_PUBLIC_KEY, 'base64'),
    },
    sign: { algorithm: 'RS256' },
  });
}
