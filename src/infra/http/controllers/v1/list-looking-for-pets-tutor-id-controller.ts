import { FastifyReply, FastifyRequest } from 'fastify';

import { z as zod } from 'zod';

import { container } from 'tsyringe';

import { instanceToInstance } from 'class-transformer';

import { AppError } from '@core/errors/AppError';

import { ListLookingForPetsByTutorIdUseCase } from '@domain/pet-guardian/application/use-cases/v1/list-looking-for-pets-by-tutor-id-use-case';

export async function listLookingForPetsByTutorIdController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const listLookingForPetsQueryParamsSchema = zod.object({
    // searchParam: zod.string().optional().nullable(),
    page: zod.string().optional().nullable(),
    perPage: zod.string().optional().nullable(),
    tutorId: zod.string(),
    // enabled: zod.string().optional().nullable(),
  });

  const { page, perPage, tutorId } = listLookingForPetsQueryParamsSchema.parse(
    request.query,
  );

  try {
    const listLookingForPetsByTutorIdUseCase = container.resolve(
      ListLookingForPetsByTutorIdUseCase,
    );

    const { pets, totalPets } =
      await listLookingForPetsByTutorIdUseCase.execute({
        page,
        perPage,
        tutorId,
      });

    return reply
      .status(200)
      .header('x-total-count-registers', totalPets)
      .send(instanceToInstance({ pets }));
  } catch (error) {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        status: 'error',
        message: error.message,
      });
    }
  }
}
