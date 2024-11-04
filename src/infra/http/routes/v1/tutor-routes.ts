import { FastifyInstance } from 'fastify';

export async function tutorRoutes(app: FastifyInstance) {
  app.post('/', () => {});
}
