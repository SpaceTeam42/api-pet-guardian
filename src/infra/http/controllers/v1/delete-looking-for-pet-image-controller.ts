import { FastifyReply, FastifyRequest } from 'fastify';

import { z as zod } from 'zod';

import { container } from 'tsyringe';

import { AppError } from '@core/errors/AppError';

import { DeleteLookingForPetImageUseCase } from '@domain/pet-guardian/application/use-cases/v1/delete-looking-for-pet-image-use-case';

export async function deleteLookingForPetImageController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteLookingForPetRouteParamsSchema = zod.object({
    image_id: zod.string().uuid(),
  });

  const { image_id } = deleteLookingForPetRouteParamsSchema.parse(
    request.params,
  );

  try {
    const deleteLookingForPetImageUseCase = container.resolve(
      DeleteLookingForPetImageUseCase,
    );

    await deleteLookingForPetImageUseCase.execute({ id: image_id });

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
