import { FastifyRequest, FastifyReply } from 'fastify';

import { instanceToInstance } from 'class-transformer';

import { AppError } from '@core/errors/AppError';

import { z as zod } from 'zod';

import { makeAuthenticateUserUseCase } from '../containers/factories/make-user-authenticate-use-case';

export async function authenticateUserController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateUserBodySchema = zod.object({
    email: zod.string().email(),
    password: zod.string(),
  });

  const { email, password } = authenticateUserBodySchema.parse(request.body);

  try {
    const authenticateUserUseCase = makeAuthenticateUserUseCase(reply);
    // return reply.status(201).send({ email, password });

    const { user, token, refresh_token } =
      await authenticateUserUseCase.execute({ email, password });

    return reply
      .status(201)
      .send(instanceToInstance({ user, token, refresh_token }));
  } catch (error) {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        status: 'error',
        message: error.message,
      });
    }
  }
}
