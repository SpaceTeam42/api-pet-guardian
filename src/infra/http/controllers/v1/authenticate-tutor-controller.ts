import { FastifyRequest, FastifyReply } from 'fastify';

import { instanceToInstance } from 'class-transformer';

import { AppError } from '@core/errors/AppError';

import { z as zod } from 'zod';

import { makeAuthenticateTutorUseCase } from '@infra/http/containers/factories/make-tutor-authenticate-use-case';

export async function authenticateTutorController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateTutorBodySchema = zod.object({
    email: zod.string().email(),
    password: zod.string(),
  });

  const { email, password } = authenticateTutorBodySchema.parse(request.body);

  try {
    const authenticateTutorUseCase = makeAuthenticateTutorUseCase(reply);

    const { tutor, token, refresh_token } =
      await authenticateTutorUseCase.execute({ email, password });

    return reply
      .status(201)
      .send(instanceToInstance({ tutor, token, refresh_token }));
  } catch (error) {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        status: 'error',
        message: error.message,
      });
    }
  }
}
