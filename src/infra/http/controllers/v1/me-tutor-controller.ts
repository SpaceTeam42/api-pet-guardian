import { FastifyReply, FastifyRequest } from 'fastify';

import { container } from 'tsyringe';

import { instanceToInstance } from 'class-transformer';

import { AppError } from '@core/errors/AppError';

import { ShowTutorUseCase } from '@domain/pet-guardian/application/use-cases/v1/show-tutor-use-case';

export async function meTutorController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const tutorId = request.user.sub;

  try {
    const showTutorUseCase = container.resolve(ShowTutorUseCase);

    const { tutor } = await showTutorUseCase.execute({ id: tutorId });

    return reply.status(200).send(instanceToInstance({ tutor }));
  } catch (error) {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        status: 'error',
        message: error.message,
      });
    }
  }
}
