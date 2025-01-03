import { FastifyReply, FastifyRequest } from 'fastify';

import { z as zod } from 'zod';

import { container } from 'tsyringe';

import { AppError } from '@core/errors/AppError';

import { DeleteWriterUseCase } from '@domain/pet-guardian/application/use-cases/v1/delete-writer-use-case';

export async function deleteWriterController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteWriterBodySchema = zod.object({
    email: zod.string().email(),
    password: zod.string(),
  });

  const { email, password } = deleteWriterBodySchema.parse(request.body);

  const writerId = request.user.sub;

  try {
    const deleteWriterUseCase = container.resolve(DeleteWriterUseCase);

    await deleteWriterUseCase.execute({
      authenticatedWriterId: writerId,
      email,
      password,
    });

    reply.status(204).send();
  } catch (error) {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        status: 'error',
        message: error.message,
      });
    }
  }
}
