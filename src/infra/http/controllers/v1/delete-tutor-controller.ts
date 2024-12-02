import { FastifyReply, FastifyRequest } from 'fastify';

import { container } from 'tsyringe';

import { z as zod } from 'zod';

import { AppError } from '@core/errors/AppError';

import { DeleteTutorUseCase } from '@domain/pet-guardian/application/use-cases/v1/delete-tutor-use-case';

export async function deleteTutorController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteTutorBodySchema = zod.object({
    email: zod.string().email(),
    password: zod.string(),
  });

  const { email, password } = deleteTutorBodySchema.parse(request.body);

  const tutorId = request.user.sub;

  try {
    const deleteTutorUseCase = container.resolve(DeleteTutorUseCase);

    await deleteTutorUseCase.execute({
      authenticatedTutorId: tutorId,
      email,
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
