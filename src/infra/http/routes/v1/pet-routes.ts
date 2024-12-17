import { FastifyInstance } from 'fastify';

import { verifyJWT } from '@infra/http/middlewares/verify-jwt';

import { ensuredTutorAuthenticated } from '@infra/http/middlewares/ensured-tutor-authenticated';

import { createPetController } from '@infra/http/controllers/v1/create-pet-controller';

import { listPetsController } from '@infra/http/controllers/v1/list-pets-controller';
import { showPetController } from '@infra/http/controllers/v1/show-pet-controller';

import { updatePetController } from '@infra/http/controllers/v1/update-pet-controller';
import { updateAvatarPetController } from '@infra/http/controllers/v1/update-avatar-pet-controller';

export async function petRoutes(app: FastifyInstance) {
  app.post(
    '/',
    { onRequest: [verifyJWT, ensuredTutorAuthenticated] },
    createPetController,
  );

  app.get('/', listPetsController);
  app.get('/:id', showPetController);

  app.put('/', updatePetController);

  app.patch('/avatar/:id', updateAvatarPetController);
}
