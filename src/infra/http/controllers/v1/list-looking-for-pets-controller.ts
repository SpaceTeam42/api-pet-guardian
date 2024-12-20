import { FastifyReply, FastifyRequest } from 'fastify';

import { z as zod } from 'zod';

import { container } from 'tsyringe';

import { instanceToInstance } from 'class-transformer';

import { AppError } from '@core/errors/AppError';

import { ListLookingForPetsUseCase } from '@domain/pet-guardian/application/use-cases/v1/list-looking-for-pets-use-case';

export async function listLookingForPetsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const listLookingForPetsQueryParamsSchema = zod.object({
    searchParam: zod.string().optional().nullable(),
    page: zod.string().optional().nullable(),
    perPage: zod.string().optional().nullable(),
    isFound: zod.string().optional().nullable(),
    // enabled: zod.string().optional().nullable(),
  });

  const { searchParam, page, perPage, isFound } =
    listLookingForPetsQueryParamsSchema.parse(request.query);

  try {
    const listLookingForPetsUseCase = container.resolve(
      ListLookingForPetsUseCase,
    );

    const { pets, totalPets } = await listLookingForPetsUseCase.execute({
      searchParam,
      page,
      perPage,
      isFound,
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
