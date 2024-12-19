import { FastifyReply, FastifyRequest } from 'fastify';

import { z as zod } from 'zod';

import { container } from 'tsyringe';

import { instanceToInstance } from 'class-transformer';

import { AppError } from '@core/errors/AppError';

import { CreateLookingForPetUseCase } from '@domain/pet-guardian/application/use-cases/v1/create-looking-for-pet-use-case';

export async function createLookingForPetController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createLookingForPetBodySchema = zod.object({
    name_pet: zod.string(),
    breed: zod.string(),
    gender: zod.string(),
    category_id: zod.string(),
    name_tutor: zod.string(),
    phone_tutor: zod.string(),
    phone_tutor_is_whatsapp: zod.boolean(),
    last_seen: zod.string(),
    description: zod.string(),
    is_reward: zod.boolean(),
    reward_amount: zod.number().default(0),
    state: zod.string(),
    city: zod.string(),
    tutor_id: zod.string().optional().nullable(),
    user_id: zod.string().optional().nullable(),
  });

  const {
    name_pet,
    breed,
    gender,
    category_id,
    name_tutor,
    phone_tutor,
    phone_tutor_is_whatsapp,
    last_seen,
    description,
    is_reward,
    reward_amount,
    state,
    city,
    tutor_id,
    user_id,
  } = createLookingForPetBodySchema.parse(request.body);

  try {
    const createLookingForPetUseCase = container.resolve(
      CreateLookingForPetUseCase,
    );

    const { pet } = await createLookingForPetUseCase.execute({
      name_pet,
      breed,
      gender,
      category_id,
      name_tutor,
      phone_tutor,
      phone_tutor_is_whatsapp,
      last_seen,
      description,
      is_reward,
      reward_amount,
      state,
      city,
      tutor_id,
      user_id,
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
