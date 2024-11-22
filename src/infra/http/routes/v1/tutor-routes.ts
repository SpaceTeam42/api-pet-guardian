import { FastifyInstance } from 'fastify';

import multer from 'fastify-multer';

import { verifyJWT } from '@infra/http/middlewares/verify-jwt';
import { ensuredUserAuthenticated } from '@infra/http/middlewares/ensured-user-authenticated';
import { ensuredTutorAuthenticated } from '@infra/http/middlewares/ensured-tutor-authenticated';

import { createTutorController } from '@infra/http/controllers/v1/create-tutor-controller';
import { updateAvatarTutorController } from '@infra/http/controllers/v1/update-avatar-tutor-controller';
import { updateTutorController } from '@infra/http/controllers/v1/update-tutor-controller';
import { listTutorsController } from '@infra/http/controllers/v1/list-tutors-controller';

export async function tutorRoutes(app: FastifyInstance) {
  const upload = multer();

  app.post('/', createTutorController);

  app.get(
    '/',
    { onRequest: [verifyJWT, ensuredUserAuthenticated] },
    listTutorsController,
  );

  app.patch(
    '/update/avatar',
    {
      onRequest: [verifyJWT, ensuredTutorAuthenticated],
      preHandler: upload.single('avatar'),
    },
    updateAvatarTutorController,
  );

  app.put(
    '/',
    { onRequest: [verifyJWT, ensuredTutorAuthenticated] },
    updateTutorController,
  );
}
