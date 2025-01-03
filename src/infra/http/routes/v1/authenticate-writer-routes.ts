import { FastifyInstance } from 'fastify';

import { authenticateWriterController } from '@infra/http/controllers/v1/authenticate-writer-controller';
import { createWriterRefreshTokenController } from '@infra/http/controllers/v1/create-writer-refresh-token-controller';

export async function authenticateWriterRoutes(app: FastifyInstance) {
  app.post('/session', authenticateWriterController);
  app.post('/refresh_token', createWriterRefreshTokenController);
}
