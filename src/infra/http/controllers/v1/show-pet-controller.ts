import { FastifyReply, FastifyRequest } from 'fastify';

import { z as zod } from 'zod';

import { container } from 'tsyringe';

import { instanceToInstance } from 'class-transformer';

import { AppError } from '@core/errors/AppError';

import { ShowPetUseCase } from '@domain/pet-guardian/application/use-cases/v1/show-pet-use-case';

export async function showPetController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const showPetRouteParamsSchema = zod.object({
    id: zod.string().uuid(),
  });

  const showPetQueryParamsSchema = zod.object({
    withRelation: zod.string().optional(),
  });

  const { id } = showPetRouteParamsSchema.parse(request.params);
  const { withRelation } = showPetQueryParamsSchema.parse(request.query);

  try {
    const showPetUseCase = container.resolve(ShowPetUseCase);

    const { pet } = await showPetUseCase.execute({ id, withRelation });

    return reply.status(200).send(instanceToInstance({ pet }));
  } catch (error) {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        status: 'error',
        message: error.message,
      });
    }
  }
}
