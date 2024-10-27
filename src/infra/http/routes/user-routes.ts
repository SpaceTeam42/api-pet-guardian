import { FastifyInstance } from 'fastify';

import { createUserController } from '../controllers/create-user-controller';

export async function userRoutes(app: FastifyInstance) {
  app.post('/', createUserController);
}
