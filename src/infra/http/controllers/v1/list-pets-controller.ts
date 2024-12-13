import { FastifyReply, FastifyRequest } from 'fastify';

import { z as zod } from 'zod';

import { container } from 'tsyringe';

import { instanceToInstance } from 'class-transformer';

import { AppError } from '@core/errors/AppError';

import { ListPetsUseCase } from '@domain/pet-guardian/application/use-cases/v1/list-pets-use-case';

export async function listPetsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const listPetsQueryParamsSchema = zod.object({
    searchParam: zod.string().optional().nullable(),
    page: zod.string().optional().nullable(),
    perPage: zod.string().optional().nullable(),
    adopted: zod.string().optional().nullable(),
    // enabled: zod.string().optional().nullable(),
  });

  const { searchParam, page, perPage, adopted } =
    listPetsQueryParamsSchema.parse(request.query);

  try {
    const listPetsUseCase = container.resolve(ListPetsUseCase);

    const { pets, totalPets } = await listPetsUseCase.execute({
      searchParam,
      page,
      perPage,
      adopted,
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
