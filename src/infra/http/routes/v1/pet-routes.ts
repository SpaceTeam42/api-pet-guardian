import { FastifyInstance } from 'fastify';

import { verifyJWT } from '@infra/http/middlewares/verify-jwt';

import { ensuredTutorAuthenticated } from '@infra/http/middlewares/ensured-tutor-authenticated';

import { createPetController } from '@infra/http/controllers/v1/create-pet-controller';

export async function petRoutes(app: FastifyInstance) {
  app.post(
    '/',
    { onRequest: [verifyJWT, ensuredTutorAuthenticated] },
    createPetController,
  );
}
