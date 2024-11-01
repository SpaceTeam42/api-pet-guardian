import { FastifyReply, FastifyRequest } from 'fastify';

import { container } from 'tsyringe';

import { z as zod } from 'zod';

import { AppError } from '@core/errors/AppError';

import { UpdateUserPassword } from '@domain/pet-guardian/application/use-cases/v1/update-user-password';

export async function updateUserPasswordController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user.sub;

  const updateUserPasswordBodySchema = zod.object({
    old_password: zod.string(),
    password: zod.string(),
  });

  const { old_password, password } = updateUserPasswordBodySchema.parse(
    request.body,
  );

  try {
    const updateUserPasswordUseCase = container.resolve(UpdateUserPassword);

    await updateUserPasswordUseCase.execute({
      id: userId,
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
