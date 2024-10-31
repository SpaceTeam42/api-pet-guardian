import { FastifyRequest, FastifyReply } from 'fastify';

import { instanceToInstance } from 'class-transformer';

import { AppError } from '@core/errors/AppError';

import { z as zod } from 'zod';

import { makeCreateUserRefreshTokenUseCase } from '../../containers/factories/make-user-create-refresh-token-use-case';

export async function createUserRefreshTokenController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createUserRefreshTokenBodySchema = zod.object({
    refresh_token: zod.string(),
  });

  const { refresh_token: refreshToken } =
    createUserRefreshTokenBodySchema.parse(request.body);

  try {
    const authenticateUserUseCase = makeCreateUserRefreshTokenUseCase(reply);

    const { token, refresh_token } = await authenticateUserUseCase.execute({
      refreshToken,
    });

    return reply.status(201).send(instanceToInstance({ token, refresh_token }));
  } catch (error) {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        status: 'error',
        message: error.message,
      });
    }
  }
}
