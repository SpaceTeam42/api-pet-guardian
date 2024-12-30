import { FastifyReply, FastifyRequest } from 'fastify';

import { z as zod } from 'zod';

import { container } from 'tsyringe';

import { AppError } from '@core/errors/AppError';

import { DeletePetUseCase } from '@domain/pet-guardian/application/use-cases/v1/delete-pet-use-case';

export async function deletePetController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deletePetRouteParamsSchema = zod.object({
    id: zod.string().uuid(),
  });

  const { id } = deletePetRouteParamsSchema.parse(request.params);

  try {
    const deletePetUseCase = container.resolve(DeletePetUseCase);

    await deletePetUseCase.execute({ id });

    return reply.status(204).send();
  } catch (error) {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        status: 'error',
        message: error.message,
      });
    }
  }
}
