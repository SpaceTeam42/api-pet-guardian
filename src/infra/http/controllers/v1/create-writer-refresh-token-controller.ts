import { FastifyRequest, FastifyReply } from 'fastify';

import { instanceToInstance } from 'class-transformer';

import { AppError } from '@core/errors/AppError';

import { z as zod } from 'zod';

import { makeCreateWriterRefreshTokenUseCase } from '@infra/http/containers/factories/make-writer-create-refresh-token-use-case';

export async function createWriterRefreshTokenController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createWriterRefreshTokenBodySchema = zod.object({
    refresh_token: zod.string(),
  });

  const { refresh_token: refreshToken } =
    createWriterRefreshTokenBodySchema.parse(request.body);

  try {
    const createRefreshTokenWriterUseCase =
      makeCreateWriterRefreshTokenUseCase(reply);

    const { token, refresh_token } =
      await createRefreshTokenWriterUseCase.execute({
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
