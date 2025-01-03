import { FastifyRequest, FastifyReply } from 'fastify';

import { instanceToInstance } from 'class-transformer';

import { AppError } from '@core/errors/AppError';

import { z as zod } from 'zod';

import { makeAuthenticateWriterUseCase } from '@infra/http/containers/factories/make-writer-authenticate-use-case';

export async function authenticateWriterController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateWriterBodySchema = zod.object({
    email: zod.string().email(),
    password: zod.string(),
  });

  const { email, password } = authenticateWriterBodySchema.parse(request.body);

  try {
    const authenticateWriterUseCase = makeAuthenticateWriterUseCase(reply);

    const { writer, token, refresh_token } =
      await authenticateWriterUseCase.execute({ email, password });

    return reply
      .status(201)
      .send(instanceToInstance({ writer, token, refresh_token }));
  } catch (error) {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        status: 'error',
        message: error.message,
      });
    }
  }
}
