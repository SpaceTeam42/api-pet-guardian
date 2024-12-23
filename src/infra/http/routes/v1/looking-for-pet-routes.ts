import { FastifyInstance } from 'fastify';

import { createLookingForPetController } from '@infra/http/controllers/v1/create-looking-for-pet-controller';

import { listLookingForPetsController } from '@infra/http/controllers/v1/list-looking-for-pets-controller';
import { listLookingForPetsByTutorIdController } from '@infra/http/controllers/v1/list-looking-for-pets-tutor-id-controller';

export async function lookingForPetRoutes(app: FastifyInstance) {
  app.post('/', createLookingForPetController);

  app.get('/', listLookingForPetsController);
  app.get('/tutor', listLookingForPetsByTutorIdController);
}
