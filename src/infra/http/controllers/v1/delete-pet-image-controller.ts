import { FastifyReply, FastifyRequest } from 'fastify';

import { z as zod } from 'zod';

import { container } from 'tsyringe';

import { AppError } from '@core/errors/AppError';

import { DeletePetImageUseCase } from '@domain/pet-guardian/application/use-cases/v1/delete-pet-image-use-case';

export async function deletePetImageController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deletePetImageRouteParamsSchema = zod.object({
    image_id: zod.string().uuid(),
  });

  const { image_id } = deletePetImageRouteParamsSchema.parse(request.params);

  try {
    const deletePetImageUseCase = container.resolve(DeletePetImageUseCase);

    await deletePetImageUseCase.execute({ id: image_id });

    return reply.status(204).send();
  } catch (error) {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        status: 'error',
        message: error.message,
      });
    }

    throw error;
  }
}
