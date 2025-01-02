import { FastifyReply, FastifyRequest } from 'fastify';

import { z as zod } from 'zod';

import { container } from 'tsyringe';

import { instanceToInstance } from 'class-transformer';

import { AppError } from '@core/errors/AppError';

import { CreateWriterUseCase } from '@domain/pet-guardian/application/use-cases/v1/create-writer-use-case';

export async function createWriterController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createWriterBodySchema = zod.object({
    name: zod.string(),
    email: zod.string(),
    password: zod.string(),
    instagram: zod.string(),
  });

  const { name, email, password, instagram } = createWriterBodySchema.parse(
    request.body,
  );

  try {
    const createWriterUseCase = container.resolve(CreateWriterUseCase);

    const { writer } = await createWriterUseCase.execute({
      name,
      email,
      password,
      instagram,
    });

    return reply.status(201).send(instanceToInstance({ writer }));
  } catch (error) {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        status: 'error',
        message: error.message,
      });
    }
  }
}
