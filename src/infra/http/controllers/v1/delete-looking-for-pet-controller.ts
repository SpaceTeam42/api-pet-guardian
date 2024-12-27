import { FastifyReply, FastifyRequest } from 'fastify';

import { z as zod } from 'zod';

import { container } from 'tsyringe';

import { AppError } from '@core/errors/AppError';

import { DeleteLookingForPetUseCase } from '@domain/pet-guardian/application/use-cases/v1/delete-looking-for-pet-use-case';

export async function deleteLookingForPetController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteLookingForPetRouteParamsSchema = zod.object({
    id: zod.string().uuid(),
  });

  const { id } = deleteLookingForPetRouteParamsSchema.parse(request.params);

  try {
    const deleteLookingForPetUseCase = container.resolve(
      DeleteLookingForPetUseCase,
    );

    await deleteLookingForPetUseCase.execute({ id });

    return reply.status(204).send({ message: 'Success' });
  } catch (error) {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        status: 'error',
        message: error.message,
      });
    }
  }
}
