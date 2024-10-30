import { FastifyInstance } from 'fastify';

import { createUserController } from '../controllers/create-user-controller';
import { listUsersController } from '../controllers/list-all-users-controller';
import { verifyJWT } from '../middlewares/verify-jwt';

export async function userRoutes(app: FastifyInstance) {
  app.post('/', createUserController);

  app.get('/', { onRequest: [verifyJWT] }, listUsersController);
}
