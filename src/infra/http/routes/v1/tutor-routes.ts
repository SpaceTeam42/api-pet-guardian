import { FastifyInstance } from 'fastify';

import { createTutorController } from '@infra/http/controllers/v1/create-tutor-controller';

export async function tutorRoutes(app: FastifyInstance) {
  app.post('/', createTutorController);
}
