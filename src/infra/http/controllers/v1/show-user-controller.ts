import { FastifyReply, FastifyRequest } from 'fastify';

import { container } from 'tsyringe';

import { instanceToInstance } from 'class-transformer';

import { AppError } from '@core/errors/AppError';

import { ShowUserUseCase } from '@domain/pet-guardian/application/use-cases/v1/show-user-use-case';

import { z as zod } from 'zod';

export async function showUserController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const showUserRouteParamsSchema = zod.object({
    id: zod.string().uuid(),
  });

  const { id } = showUserRouteParamsSchema.parse(request.params);

  try {
    const showUserUseCase = container.resolve(ShowUserUseCase);

    const { user } = await showUserUseCase.execute({ id });

    return reply.status(200).send(instanceToInstance({ user }));
  } catch (error) {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        status: 'error',
        message: error.message,
      });
    }
  }
}
