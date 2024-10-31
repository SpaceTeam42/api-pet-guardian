import { FastifyReply, FastifyRequest } from 'fastify';

import { container } from 'tsyringe';

import { z as zod } from 'zod';

import { ListUsersUseCase } from '@domain/pet-guardian/application/use-cases/v1/list-users-use-case';
import { AppError } from '@core/errors/AppError';
import { instanceToInstance } from 'class-transformer';

export async function listUsersController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user.sub;

  const listAllUsersQueryParamsSchema = zod.object({
    searchParam: zod.string().optional(),
    page: zod.string().optional().nullable(),
    perPage: zod.string().optional(),
    enabled: zod.string().optional().nullable(),
  });

  const { searchParam, page, perPage, enabled } =
    listAllUsersQueryParamsSchema.parse(request.query);

  try {
    const listUsersUseCase = container.resolve(ListUsersUseCase);

    const { users, totalUsers } = await listUsersUseCase.execute({
      authenticateUserId: userId,
      searchParam,
      page,
      perPage,
      enabled,
    });

    return reply
      .status(200)
      .header('x-total-count-registers', totalUsers)
      .send({ users: instanceToInstance(users) });
  } catch (error) {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        status: 'error',
        message: error.message,
      });
    }
  }
}
