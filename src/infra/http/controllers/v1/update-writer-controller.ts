import { FastifyReply, FastifyRequest } from 'fastify';

import { z as zod } from 'zod';

import { container } from 'tsyringe';

import { instanceToInstance } from 'class-transformer';

import { AppError } from '@core/errors/AppError';

import { UpdateWriterUseCase } from '@domain/pet-guardian/application/use-cases/v1/update-writer-use-case';

export async function updateWriterController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateWriterBodySchema = zod.object({
    id: zod.string().uuid(),
    name: zod.string(),
    email: zod.string(),
    instagram: zod.string(),
    enabled: zod.boolean(),
  });

  const { id, name, email, instagram, enabled } = updateWriterBodySchema.parse(
    request.body,
  );

  try {
    const updateWriterUseCase = container.resolve(UpdateWriterUseCase);

    const { writer } = await updateWriterUseCase.execute({
      id,
      name,
      email,
      instagram,
      enabled,
    });

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
