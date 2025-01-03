import { FastifyReply, FastifyRequest } from 'fastify';

import { container } from 'tsyringe';

import { z as zod } from 'zod';

import { AppError } from '@core/errors/AppError';

import { UpdateTutorPasswordUseCase } from '@domain/pet-guardian/application/use-cases/v1/update-tutor-password-use-case';

export async function updateTutorPasswordController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const tutorId = request.user.sub;

  const updateTutorPasswordBodySchema = zod.object({
    old_password: zod.string(),
    password: zod.string(),
  });

  const { old_password, password } = updateTutorPasswordBodySchema.parse(
    request.body,
  );

  try {
    const updateTutorPasswordUseCase = container.resolve(
      UpdateTutorPasswordUseCase,
    );

    await updateTutorPasswordUseCase.execute({
      id: tutorId,
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
