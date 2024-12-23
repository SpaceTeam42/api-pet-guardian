import { FastifyReply, FastifyRequest } from 'fastify';

import { z as zod } from 'zod';

import { container } from 'tsyringe';

import { AppError } from '@core/errors/AppError';

import { ShowLookingForPetUseCase } from '@domain/pet-guardian/application/use-cases/v1/show-looking-for-pet-use-case';

export async function showLookingForPetController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const showLookingForPetQueryParamsSchema = zod.object({
    id: zod.string().uuid(),
    withRelation: zod.string().optional().nullable(),
  });

  const { id, withRelation } = showLookingForPetQueryParamsSchema.parse(
    request.query,
  );

  try {
    const showLookingForPetUseCase = container.resolve(
      ShowLookingForPetUseCase,
    );

    const { pet } = await showLookingForPetUseCase.execute({
      id,
      withRelation,
    });

    return reply.status(200).send({ pet });
  } catch (error) {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        status: 'error',
        message: error.message,
      });
    }
  }
}
