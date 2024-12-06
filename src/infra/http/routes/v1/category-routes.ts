import { FastifyInstance } from 'fastify';

import { verifyJWT } from '@infra/http/middlewares/verify-jwt';

import { ensuredUserAuthenticated } from '@infra/http/middlewares/ensured-user-authenticated';

import { createCategoryController } from '@infra/http/controllers/v1/create-category-controller';
import { listCategoriesController } from '@infra/http/controllers/v1/list-categories-controller';

export async function categoryRoutes(app: FastifyInstance) {
  app.post(
    '/',
    { onRequest: [verifyJWT, ensuredUserAuthenticated] },
    createCategoryController,
  );

  app.get('/', listCategoriesController);
}
