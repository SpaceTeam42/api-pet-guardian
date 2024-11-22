import { FastifyReply, FastifyRequest } from 'fastify';

import { AppError } from '@core/errors/AppError';

import { UsersRepository } from '@infra/database/repositories/typeorm/typeorm-users-repository';

export async function ensuredUserAuthenticated(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const userId = request.user.sub;

    const usersRepository = new UsersRepository();

    const user = await usersRepository.findById(userId);

    if (!user || user.enabled === false) {
      throw new AppError('Unauthorized!', 401);
    }
  } catch (error) {
    return reply.status(401).send({ error: 'Unauthorized!' });
  }
}
