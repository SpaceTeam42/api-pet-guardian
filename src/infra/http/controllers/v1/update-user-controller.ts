import { FastifyReply, FastifyRequest } from 'fastify';

import { container } from 'tsyringe';

import { instanceToInstance } from 'class-transformer';

import { z as zod } from 'zod';

import { AppError } from '@core/errors/AppError';

import { UpdateUseUseCase } from '@domain/pet-guardian/application/use-cases/v1/update-user-use-case';

export async function updateUserController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateUserBodySchema = zod.object({
    id: zod.string().uuid(),
    name: zod.string(),
    email: zod.string().email(),
    type: zod.enum(['ADMIN', 'USER', 'WRITER']),
    enabled: zod.boolean(),
  });

  const { id, name, email, type, enabled } = updateUserBodySchema.parse(
    request.body,
  );

  try {
    const updateUserUseCase = container.resolve(UpdateUseUseCase);

    const { user } = await updateUserUseCase.execute({
      id,
      name,
      email,
      type,
      enabled,
    });

    return reply.status(200).send(instanceToInstance({ user }));
  } catch (error) {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        status: 'error',
        message: error.message,
      });
    }
  }
}
