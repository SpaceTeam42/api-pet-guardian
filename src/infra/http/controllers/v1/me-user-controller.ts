import { FastifyReply, FastifyRequest } from 'fastify';

import { container } from 'tsyringe';

import { instanceToInstance } from 'class-transformer';

import { AppError } from '@core/errors/AppError';

import { ShowUserUseCase } from '@domain/pet-guardian/application/use-cases/v1/show-user-use-case';

export async function meUserController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user.sub;

  try {
    const showUserUseCase = container.resolve(ShowUserUseCase);

    const { user } = await showUserUseCase.execute({ id: userId });

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
