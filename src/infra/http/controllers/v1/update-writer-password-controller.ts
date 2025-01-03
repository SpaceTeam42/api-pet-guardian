import { FastifyReply, FastifyRequest } from 'fastify';

import { container } from 'tsyringe';

import { z as zod } from 'zod';

import { AppError } from '@core/errors/AppError';

import { UpdateWriterPasswordUseCase } from '@domain/pet-guardian/application/use-cases/v1/update-writer-password-use-case';

export async function updateWriterPasswordController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const writerId = request.user.sub;

  const updateWriterPasswordBodySchema = zod.object({
    old_password: zod.string(),
    password: zod.string(),
  });

  const { old_password, password } = updateWriterPasswordBodySchema.parse(
    request.body,
  );

  try {
    const updateWriterPasswordUseCase = container.resolve(
      UpdateWriterPasswordUseCase,
    );

    await updateWriterPasswordUseCase.execute({
      id: writerId,
      oldPassword: old_password,
      password,
    });

    return reply.status(204).send();
  } catch (error) {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        status: 'error',
        message: error.message,
      });
    }
  }
}
