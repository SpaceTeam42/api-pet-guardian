import { FastifyRequest, FastifyReply } from 'fastify';

import { instanceToInstance } from 'class-transformer';

import { AppError } from '@core/errors/AppError';

import { z as zod } from 'zod';

import { makeCreateTutorRefreshTokenUseCase } from '@infra/http/containers/factories/make-tutor-create-refresh-token-use-case';

export async function createTutorRefreshTokenController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createTutorRefreshTokenBodySchema = zod.object({
    refresh_token: zod.string(),
  });

  const { refresh_token: refreshToken } =
    createTutorRefreshTokenBodySchema.parse(request.body);

  try {
    const createRefreshTokenTutorUseCase =
      makeCreateTutorRefreshTokenUseCase(reply);

    const { token, refresh_token } =
      await createRefreshTokenTutorUseCase.execute({
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
