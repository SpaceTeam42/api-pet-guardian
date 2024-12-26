import { FastifyReply, FastifyRequest } from 'fastify';

import { z as zod } from 'zod';

import { container } from 'tsyringe';

import { instanceToInstance } from 'class-transformer';

import { AppError } from '@core/errors/AppError';

import { UpdateLookingForPetUseCase } from '@domain/pet-guardian/application/use-cases/v1/update-looking-for-pet-use-case';

export async function updateLookingForPetController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateLookingForPetBodySchema = zod.object({
    id: zod.string().uuid(),
    name_pet: zod.string(),
    breed: zod.string(),
    gender: zod.string(),
    category_id: zod.string().uuid(),
    name_tutor: zod.string(),
    phone_tutor: zod.string(),
    phone_tutor_is_whatsapp: zod.boolean(),
    last_seen: zod.string(),
    description: zod.string(),
    is_found: zod.boolean(),
    is_reward: zod.boolean(),
    reward_amount: zod.number(),
    state: zod.string(),
    city: zod.string(),
    enabled: zod.boolean(),
  });

  const {
    id,
    name_pet,
    breed,
    gender,
    category_id,
    name_tutor,
    phone_tutor,
    phone_tutor_is_whatsapp,
    last_seen,
    description,
    is_found,
    is_reward,
    reward_amount,
    state,
    city,
    enabled,
  } = updateLookingForPetBodySchema.parse(request.body);

  try {
    const updateLookingForPetUseCase = container.resolve(
      UpdateLookingForPetUseCase,
    );

    const { pet } = await updateLookingForPetUseCase.execute({
      id,
      name_pet,
      breed,
      gender,
      category_id,
      name_tutor,
      phone_tutor,
      phone_tutor_is_whatsapp,
      last_seen,
      description,
      is_found,
      is_reward,
      reward_amount,
      state,
      city,
      enabled,
    });

    return reply.status(200).send(instanceToInstance({ pet }));
  } catch (error) {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        status: 'error',
        message: error.message,
      });
    }
  }
}
