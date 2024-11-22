import { FastifyReply, FastifyRequest } from 'fastify';

import { container } from 'tsyringe';

import { z as zod } from 'zod';

import { ListTutorsUseCase } from '@domain/pet-guardian/application/use-cases/v1/list-tutors-use-case';
import { instanceToInstance } from 'class-transformer';

export async function listTutorsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const listTutorsQueryParamsSchema = zod.object({
    searchParam: zod.string().optional(),
    page: zod.string().optional().nullable(),
    perPage: zod.string().optional(),
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
      .header('x-total-count-register', totalTutors.toString())
      .send(instanceToInstance({ tutors }));
  } catch (error) {}
}
