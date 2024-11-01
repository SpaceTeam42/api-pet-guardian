import { FastifyInstance } from 'fastify';

import { userRoutes } from './v1/user-routes';
import { authenticateUserRoutes } from './v1/authenticate-user-routes';

export async function appRoutes(app: FastifyInstance) {
  app.register(userRoutes, {
    prefix: '/v1/users',
  });

  app.register(authenticateUserRoutes, {
    prefix: '/v1/authenticate_user',
  });
}
