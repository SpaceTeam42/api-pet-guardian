import { FastifyReply, FastifyRequest } from 'fastify';

import { z as zod } from 'zod';

import { container } from 'tsyringe';

import { instanceToInstance } from 'class-transformer';

import { AppError } from '@core/errors/AppError';

import { ShowWriterUseCase } from '@domain/pet-guardian/application/use-cases/v1/show-writer-use-case';

export async function showWriterController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const showWriterRouteParamsSchema = zod.object({
    id: zod.string().uuid(),
  });

  const { id } = showWriterRouteParamsSchema.parse(request.params);

  try {
    const showWriterUseCase = container.resolve(ShowWriterUseCase);

    const { writer } = await showWriterUseCase.execute({ id });

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
