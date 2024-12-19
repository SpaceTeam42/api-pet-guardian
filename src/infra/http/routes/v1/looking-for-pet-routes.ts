import { createLookingForPetController } from '@infra/http/controllers/v1/create-looking-for-pet-controller';
import { FastifyInstance } from 'fastify';

export async function lookingForPetRoutes(app: FastifyInstance) {
  app.post('/', createLookingForPetController);
}
