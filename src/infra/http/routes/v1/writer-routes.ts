import { FastifyInstance } from 'fastify';

import { createWriterController } from '@infra/http/controllers/v1/create-writer-controller';
import { listWritersController } from '@infra/http/controllers/v1/list-writers-controller';
import { meWriterController } from '@infra/http/controllers/v1/me-writer-controller';
import { showWriterController } from '@infra/http/controllers/v1/show-writer-controller';

import { verifyJWT } from '@infra/http/middlewares/verify-jwt';
import { ensuredWriterAuthenticated } from '@infra/http/middlewares/ensured-writer-authenticated';
import { updateWriterController } from '@infra/http/controllers/v1/update-writer-controller';
import { updateAvatarWriterController } from '@infra/http/controllers/v1/update-avatar-writer-controller';

export async function writerRoutes(app: FastifyInstance) {
  app.post('/', createWriterController);

  app.get('/', listWritersController);

  app.get('/show/:id', showWriterController);

  app.get(
    '/me',
    { onRequest: [verifyJWT, ensuredWriterAuthenticated] },
    meWriterController,
  );

  app.put('/', updateWriterController);

  app.patch(
    '/update/avatar',
    {
      onRequest: [verifyJWT, ensuredWriterAuthenticated],
    },
    updateAvatarWriterController,
  );
}
