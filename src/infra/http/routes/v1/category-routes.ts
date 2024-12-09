import { FastifyInstance } from 'fastify';

import { verifyJWT } from '@infra/http/middlewares/verify-jwt';

import { ensuredUserAuthenticated } from '@infra/http/middlewares/ensured-user-authenticated';

import { createCategoryController } from '@infra/http/controllers/v1/create-category-controller';

import { listCategoriesController } from '@infra/http/controllers/v1/list-categories-controller';
import { showCategoryController } from '@infra/http/controllers/v1/show-category-controller';

import { updateCategoryController } from '@infra/http/controllers/v1/update-category-controller';
import { updateCategoryIconController } from '@infra/http/controllers/v1/update-category-icon-controller';

export async function categoryRoutes(app: FastifyInstance) {
  app.post(
    '/',
    { onRequest: [verifyJWT, ensuredUserAuthenticated] },
    createCategoryController,
  );

  app.get('/', listCategoriesController);
  app.get('/show/:id', showCategoryController);

  app.put(
    '/',
    { onRequest: [verifyJWT, ensuredUserAuthenticated] },
    updateCategoryController,
  );

  app.patch(
    '/update/icon/:id',
    { onRequest: [verifyJWT, ensuredUserAuthenticated] },
    updateCategoryIconController,
  );
}
