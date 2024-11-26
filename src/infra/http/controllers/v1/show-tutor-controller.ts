import { FastifyReply, FastifyRequest } from 'fastify';

import { container } from 'tsyringe';

import { instanceToInstance } from 'class-transformer';

import { z as zod } from 'zod';

import { AppError } from '@core/errors/AppError';

import { ShowTutorUseCase } from '@domain/pet-guardian/application/use-cases/v1/show-tutor-use-case';

export async function showTutorController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const showTutorRouteParamsSchema = zod.object({
    id: zod.string().uuid(),
  });

  const { id } = showTutorRouteParamsSchema.parse(request.params);

  try {
    const showTutorUseCase = container.resolve(ShowTutorUseCase);

    const { tutor } = await showTutorUseCase.execute({ id });

    return reply.status(200).send(instanceToInstance({ tutor }));
  } catch (error) {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        status: 'error',
        message: error.message,
      });
    }
  }
}
