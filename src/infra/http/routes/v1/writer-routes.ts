import { createWriterController } from '@infra/http/controllers/v1/create-writer-controller';
import { FastifyInstance } from 'fastify';

export async function writerRoutes(app: FastifyInstance) {
  app.post('/', createWriterController);
}
