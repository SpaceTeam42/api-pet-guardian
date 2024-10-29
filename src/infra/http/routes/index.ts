import { FastifyInstance } from 'fastify';

import { userRoutes } from './user-routes';
import { authenticateUserRoutes } from './authenticate-user-routes';

export async function appRoutes(app: FastifyInstance) {
  app.register(userRoutes, {
    prefix: '/users',
  });

  app.register(authenticateUserRoutes, {
    prefix: '/authenticate_user',
  });
}
