import { FastifyInstance } from 'fastify';

import { verifyJWT } from '@infra/http/middlewares/verify-jwt';

import { createUserController } from '@infra/http/controllers/v1/create-user-controller';
import { listUsersController } from '@infra/http/controllers/v1/list-users-controller';
import { showUserController } from '@infra/http/controllers/v1/show-user-controller';
import { meUserController } from '@infra/http/controllers/v1/me-user-controller';
import { updateUserController } from '@infra/http/controllers/v1/update-user-controller';
import { updateUserPasswordController } from '@infra/http/controllers/v1/update-user-password-controller';

export async function userRoutes(app: FastifyInstance) {
  app.post('/', createUserController);

  app.get('/', { onRequest: [verifyJWT] }, listUsersController);
  app.get('/show/:id', { onRequest: [verifyJWT] }, showUserController);
  app.get('/me', { onRequest: [verifyJWT] }, meUserController);

  app.put('/', { onRequest: [verifyJWT] }, updateUserController);

  app.patch(
    '/update/password',
    { onRequest: [verifyJWT] },
    updateUserPasswordController,
  );
}
