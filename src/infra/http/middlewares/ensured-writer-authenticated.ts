import { FastifyReply, FastifyRequest } from 'fastify';

import { AppError } from '@core/errors/AppError';

import { WritersRepository } from '@infra/database/repositories/typeorm/typeorm-writers-repository';

export async function ensuredWriterAuthenticated(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const writerId = request.user.sub;

    const writersRepository = new WritersRepository();

    const writer = await writersRepository.findById(writerId);

    if (!writer || writer.enabled === false) {
      throw new AppError('Unauthorized!', 401);
    }
  } catch (error) {
    return reply.status(401).send({ error: 'Unauthorized!' });
  }
}
