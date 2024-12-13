import { FastifyInstance } from 'fastify';

import { verifyJWT } from '@infra/http/middlewares/verify-jwt';

import { ensuredTutorAuthenticated } from '@infra/http/middlewares/ensured-tutor-authenticated';

import { createPetController } from '@infra/http/controllers/v1/create-pet-controller';

import { listPetsController } from '@infra/http/controllers/v1/list-pets-controller';

export async function petRoutes(app: FastifyInstance) {
  app.post(
    '/',
    { onRequest: [verifyJWT, ensuredTutorAuthenticated] },
    createPetController,
  );

  app.get('/', listPetsController);
}
