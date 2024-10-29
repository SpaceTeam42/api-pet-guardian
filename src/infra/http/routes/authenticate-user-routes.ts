import { FastifyInstance } from 'fastify';

import { authenticateUserController } from '../controllers/authenticate-user-controller';
import { createUserRefreshTokenController } from '../controllers/create-user-refresh-token-controller';

export async function authenticateUserRoutes(app: FastifyInstance) {
  app.post('/session', authenticateUserController);
  app.post('/refresh_token', createUserRefreshTokenController);
}
