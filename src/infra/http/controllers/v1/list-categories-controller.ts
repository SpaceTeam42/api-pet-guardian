import { FastifyReply, FastifyRequest } from 'fastify';

import { container } from 'tsyringe';

import { z as zod } from 'zod';

import { instanceToInstance } from 'class-transformer';

import { AppError } from '@core/errors/AppError';

import { ListCategoriesUseCase } from '@domain/pet-guardian/application/use-cases/v1/list-categories-use-case';

export async function listCategoriesController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const listCategoriesQueryParamsSchema = zod.object({
    searchParam: zod.string().optional().nullable(),
    page: zod.string().optional().nullable(),
    perPage: zod.string().optional().nullable(),
    enabled: zod.string().optional().nullable(),
  });

  const { searchParam, page, perPage, enabled } =
    listCategoriesQueryParamsSchema.parse(request.query);

  try {
    const listCategoriesUseCase = container.resolve(ListCategoriesUseCase);

    const { categories, totalCategories } = await listCategoriesUseCase.execute(
      {
        searchParam,
        page,
        perPage,
        enabled,
      },
    );

    return reply
      .header('x-total-count-register', totalCategories)
      .status(200)
      .send(instanceToInstance({ categories }));
  } catch (error) {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        status: 'error',
        message: error.message,
      });
    }
  }
}
