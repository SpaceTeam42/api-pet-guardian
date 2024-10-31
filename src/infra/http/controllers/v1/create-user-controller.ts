import { FastifyRequest, FastifyReply } from 'fastify';

import { container } from 'tsyringe';

import { z as zod } from 'zod';

import { instanceToInstance } from 'class-transformer';

import { AppError } from '@core/errors/AppError';

import { CreateUserUseCase } from '@domain/pet-guardian/application/use-cases/v1/create-user-use-case';

export async function createUserController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createUserBodySchema = zod.object({
    name: zod.string(),
    email: zod.string().email(),
    password: zod.string(),
    type: zod.enum(['ADMIN', 'USER', 'WRITER']),
  });

  const { name, email, password, type } = createUserBodySchema.parse(
    request.body,
  );

  try {
    const createUserUseCase = container.resolve(CreateUserUseCase);

    const { user } = await createUserUseCase.execute({
      name,
      email,
      password,
      type,
    });

    return reply.status(201).send({ user: instanceToInstance(user) });
  } catch (error) {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        status: 'error',
        message: error.message,
      });
    }
  }
}
