import { FastifyInstance } from 'fastify';

import { createLookingForPetController } from '@infra/http/controllers/v1/create-looking-for-pet-controller';

import { listLookingForPetsController } from '@infra/http/controllers/v1/list-looking-for-pets-controller';

export async function lookingForPetRoutes(app: FastifyInstance) {
  app.post('/', createLookingForPetController);

  app.get('/', listLookingForPetsController);
}
