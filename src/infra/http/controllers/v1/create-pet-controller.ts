import { FastifyReply, FastifyRequest } from 'fastify';

import { z as zod } from 'zod';

import { container } from 'tsyringe';

import { instanceToInstance } from 'class-transformer';

import { AppError } from '@core/errors/AppError';

import { CreatePetUseCase } from '@domain/pet-guardian/application/use-cases/create-pet-use-case';

export async function createPetController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createPetBodySchema = zod.object({
    name: zod.string(),
    birthday: zod.string(),
    breed: zod.string(),
    category_id: zod.string().uuid(),
    gender: zod.string(),
    size: zod.string(),
    weight: zod.string(),
    description: zod.string(),
    city: zod.string(),
    state: zod.string(),
  });

  const {
    name,
    birthday,
    breed,
    category_id,
    gender,
    size,
    weight,
    description,
    city,
    state,
  } = createPetBodySchema.parse(request.body);

  const tutorId = request.user.sub;

  try {
    const createPetUseCase = container.resolve(CreatePetUseCase);

    const { pet } = await createPetUseCase.execute({
      name,
      birthday: new Date(birthday),
      breed,
      category_id,
      gender,
      size,
      weight,
      tutor_id: tutorId,
      description,
      city,
      state,
    });

    return reply.status(201).send(instanceToInstance({ pet }));
  } catch (error) {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        status: 'error',
        message: error.message,
      });
    }
  }
}
