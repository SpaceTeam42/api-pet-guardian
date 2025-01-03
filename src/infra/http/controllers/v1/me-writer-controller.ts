import { FastifyReply, FastifyRequest } from 'fastify';

import { container } from 'tsyringe';

import { instanceToInstance } from 'class-transformer';

import { AppError } from '@core/errors/AppError';

import { ShowWriterUseCase } from '@domain/pet-guardian/application/use-cases/v1/show-writer-use-case';

export async function meWriterController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const writerId = request.user.sub;

  try {
    const showWriterUseCase = container.resolve(ShowWriterUseCase);

    const { writer } = await showWriterUseCase.execute({ id: writerId });

    return reply.status(200).send(instanceToInstance({ writer }));
  } catch (error) {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        status: 'error',
        message: error.message,
      });
    }
  }
}
