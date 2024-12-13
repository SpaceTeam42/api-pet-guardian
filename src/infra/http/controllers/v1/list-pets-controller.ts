import { FastifyReply, FastifyRequest } from 'fastify';

import { z as zod } from 'zod';

import { container } from 'tsyringe';

import { AppError } from '@core/errors/AppError';

import { ListPetsUseCase } from '@domain/pet-guardian/application/use-cases/v1/list-pets-use-case';

export async function listPetsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const listPetsQueryParamsSchema = zod.object({
    adopted: zod.string().optional().nullable(),
    // searchParam: zod.string().optional().nullable(),
    page: zod.string().optional().nullable(),
    perPage: zod.string().optional().nullable(),
    // enabled: zod.string().optional().nullable(),
  });

  const { adopted, page, perPage } = listPetsQueryParamsSchema.parse(
    request.query,
  );

  try {
    const listPetsUseCase = container.resolve(ListPetsUseCase);

    const {} = await listPetsUseCase.execute({ adopted, page, perPage });
  } catch (error) {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        status: 'error',
        message: error.message,
      });
    }
  }
}
