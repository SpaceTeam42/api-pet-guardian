import { FastifyReply, FastifyRequest } from 'fastify';

import { z as zod } from 'zod';

import { container } from 'tsyringe';

import { instanceToInstance } from 'class-transformer';

import { AppError } from '@core/errors/AppError';

import { ShowCategoryUseCase } from '@domain/pet-guardian/application/use-cases/v1/show-category-use-case';

export async function showCategoryController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const showCategoryRouteParamSchema = zod.object({
    id: zod.string().uuid(),
  });

  const { id } = showCategoryRouteParamSchema.parse(request.params);

  try {
    const showCategoryUseCase = container.resolve(ShowCategoryUseCase);

    const { category } = await showCategoryUseCase.execute({ id });

    return reply.status(200).send(instanceToInstance({ category }));
  } catch (error) {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        status: 'error',
        message: error.message,
      });
    }
  }
}
