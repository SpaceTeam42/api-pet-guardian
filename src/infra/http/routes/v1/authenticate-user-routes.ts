import { FastifyInstance } from 'fastify';

import { authenticateUserController } from '@infra/http/controllers/v1/authenticate-user-controller';
import { createUserRefreshTokenController } from '@infra/http/controllers/v1/create-user-refresh-token-controller';

export async function authenticateUserRoutes(app: FastifyInstance) {
  app.post('/session', authenticateUserController);
  app.post('/refresh_token', createUserRefreshTokenController);
}
