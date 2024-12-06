import { FastifyReply, FastifyRequest } from 'fastify';

import { container } from 'tsyringe';

import { z as zod } from 'zod';

import { instanceToInstance } from 'class-transformer';

import { AppError } from '@core/errors/AppError';

import { CreateCategoryUseCase } from '@domain/pet-guardian/application/use-cases/v1/create-category-use-case';

export async function createCategoryController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createCategoryBodySchema = zod.object({
    name: zod.string(),
  });

  const { name } = createCategoryBodySchema.parse(request.body);

  try {
    const createCategoryUseCase = container.resolve(CreateCategoryUseCase);

    const { category } = await createCategoryUseCase.execute({ name });

    return reply.status(201).send(instanceToInstance({ category }));
  } catch (error) {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        status: 'error',
        message: error.message,
      });
    }
  }
}
