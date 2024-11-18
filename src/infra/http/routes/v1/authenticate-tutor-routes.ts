import { FastifyInstance } from 'fastify';

import { authenticateTutorController } from '@infra/http/controllers/v1/authenticate-tutor-controller';
import { createTutorRefreshTokenController } from '@infra/http/controllers/v1/create-tutor-refresh-token-controller';

export async function authenticateTutorRoutes(app: FastifyInstance) {
  app.post('/session', authenticateTutorController);
  app.post('/refresh_token', createTutorRefreshTokenController);
}
