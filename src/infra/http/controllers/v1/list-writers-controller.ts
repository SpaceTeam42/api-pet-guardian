import { FastifyReply, FastifyRequest } from 'fastify';

import { container } from 'tsyringe';

import { instanceToInstance } from 'class-transformer';

import { z as zod } from 'zod';

import { AppError } from '@core/errors/AppError';

import { ListWritersUseCase } from '@domain/pet-guardian/application/use-cases/v1/list-writers-use-case';

export async function listWritersController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const listWritersQueryParamsSchema = zod.object({
    searchParam: zod.string().optional().nullable(),
    page: zod.string().optional().nullable(),
    perPage: zod.string().optional().nullable(),
    enabled: zod.string().optional().nullable(),
  });

  const { searchParam, page, perPage, enabled } =
    listWritersQueryParamsSchema.parse(request.query);

  try {
    const listWritersUseCase = container.resolve(ListWritersUseCase);

    const { writers, totalWriters } = await listWritersUseCase.execute({
      searchParam,
      page,
      perPage,
      enabled,
    });

    return reply
      .status(200)
      .header('x-total-count-register', totalWriters)
      .send(instanceToInstance({ writers }));
  } catch (error) {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        status: 'error',
        message: error.message,
      });
    }
  }
}
