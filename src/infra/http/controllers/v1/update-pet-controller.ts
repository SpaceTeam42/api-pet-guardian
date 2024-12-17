import { FastifyReply, FastifyRequest } from 'fastify';

import { z as zod } from 'zod';

import { container } from 'tsyringe';

import { instanceToInstance } from 'class-transformer';

import { AppError } from '@core/errors/AppError';

import { UpdatePetUseCase } from '@domain/pet-guardian/application/use-cases/v1/update-pet-use-case';

export async function updatePetController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updatePetBodySchema = zod.object({
    id: zod.string().uuid(),
    name: zod.string(),
    birthday: zod.string(),
    breed: zod.string(),
    category_id: zod.string().uuid(),
    gender: zod.string(),
    size: zod.string(),
    weight: zod.string(),
    tutor_id: zod.string().uuid(),
    description: zod.string(),
    city: zod.string(),
    state: zod.string(),
  });

  const {
    id,
    name,
    birthday,
    breed,
    category_id,
    gender,
    size,
    weight,
    tutor_id,
    description,
    city,
    state,
  } = updatePetBodySchema.parse(request.body);

  try {
    const updatePetUseCase = container.resolve(UpdatePetUseCase);

    const { pet } = await updatePetUseCase.execute({
      id,
      name,
      birthday,
      breed,
      category_id,
      gender,
      size,
      weight,
      tutor_id,
      description,
      city,
      state,
    });

    return reply.status(200).send(instanceToInstance({ pet }));
    // return reply.send({ birthday: new Date(birthday) });
  } catch (error) {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        status: 'error',
        message: error.message,
      });
    }
  }
}
