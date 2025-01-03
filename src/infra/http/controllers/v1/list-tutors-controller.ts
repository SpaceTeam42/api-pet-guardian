import { FastifyReply, FastifyRequest } from 'fastify';

import { container } from 'tsyringe';

import { instanceToInstance } from 'class-transformer';

import { z as zod } from 'zod';

import { AppError } from '@core/errors/AppError';

import { ListTutorsUseCase } from '@domain/pet-guardian/application/use-cases/v1/list-tutors-use-case';

export async function listTutorsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const listTutorsQueryParamsSchema = zod.object({
    searchParam: zod.string().optional().nullable(),
    page: zod.string().optional().nullable(),
    perPage: zod.string().optional().nullable(),
    enabled: zod.string().optional().nullable(),
  });

  const { searchParam, page, perPage, enabled } =
    listTutorsQueryParamsSchema.parse(request.query);

  try {
    const listTutorsUseCase = container.resolve(ListTutorsUseCase);

    const { tutors, totalTutors } = await listTutorsUseCase.execute({
      searchParam,
      page,
      perPage,
      enabled,
    });

    return reply
      .status(200)
      .header('x-total-count-register', totalTutors)
      .send(instanceToInstance({ tutors }));
  } catch (error) {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        status: 'error',
        message: error.message,
      });
    }
  }
}
