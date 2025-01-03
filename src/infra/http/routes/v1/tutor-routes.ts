import { FastifyInstance } from 'fastify';

// import uploadConfig from '@config/upload';

// import multer from 'fastify-multer';

import { verifyJWT } from '@infra/http/middlewares/verify-jwt';
import { ensuredUserAuthenticated } from '@infra/http/middlewares/ensured-user-authenticated';
import { ensuredTutorAuthenticated } from '@infra/http/middlewares/ensured-tutor-authenticated';

import { createTutorController } from '@infra/http/controllers/v1/create-tutor-controller';

import { updateAvatarTutorController } from '@infra/http/controllers/v1/update-avatar-tutor-controller';
import { updateTutorController } from '@infra/http/controllers/v1/update-tutor-controller';

import { listTutorsController } from '@infra/http/controllers/v1/list-tutors-controller';
import { meTutorController } from '@infra/http/controllers/v1/me-tutor-controller';
import { showTutorController } from '@infra/http/controllers/v1/show-tutor-controller';

import { deleteTutorController } from '@infra/http/controllers/v1/delete-tutor-controller';

export async function tutorRoutes(app: FastifyInstance) {
  // const { storage } = uploadConfig.multer;

  // const upload = multer({ storage });

  // app.addContentTypeParser('*', (req, a, done) => {
  //   done(null);
  // });

  app.post('/', createTutorController);

  app.get(
    '/',
    { onRequest: [verifyJWT, ensuredUserAuthenticated] },
    listTutorsController,
  );

  app.get(
    '/me',
    { onRequest: [verifyJWT, ensuredTutorAuthenticated] },
    meTutorController,
  );

  app.get('/show/:id', showTutorController);

  app.patch(
    '/update/avatar',
    {
      onRequest: [verifyJWT, ensuredTutorAuthenticated],
      // preHandler: upload.single('avatar'),
    },
    updateAvatarTutorController,
  );

  app.put(
    '/',
    { onRequest: [verifyJWT, ensuredTutorAuthenticated] },
    updateTutorController,
  );

  app.put(
    '/update/byUser',
    { onRequest: [verifyJWT, ensuredUserAuthenticated] },
    updateTutorController,
  );

  app.delete(
    '/',
    { onRequest: [verifyJWT, ensuredTutorAuthenticated] },
    deleteTutorController,
  );
}
