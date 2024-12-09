import { FastifyReply, FastifyRequest } from 'fastify';

import { z as zod } from 'zod';

import { container } from 'tsyringe';

import { instanceToInstance } from 'class-transformer';

import { AppError } from '@core/errors/AppError';

import { UpdateCategoryUseCase } from '@domain/pet-guardian/application/use-cases/v1/update-category-use-case';

export async function updateCategoryController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateCategoryBodySchema = zod.object({
    id: zod.string().uuid(),
    name: zod.string(),
    enabled: zod.boolean(),
  });

  const { id, name, enabled } = updateCategoryBodySchema.parse(request.body);

  try {
    const updateCategoryUseCase = container.resolve(UpdateCategoryUseCase);

    const { category } = await updateCategoryUseCase.execute({
      id,
      name,
      enabled,
    });

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
