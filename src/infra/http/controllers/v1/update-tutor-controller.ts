import { FastifyReply, FastifyRequest } from 'fastify';

import { container } from 'tsyringe';

import { instanceToInstance } from 'class-transformer';

import { z as zod } from 'zod';

import { AppError } from '@core/errors/AppError';

import { UpdateTutorUseCase } from '@domain/pet-guardian/application/use-cases/v1/update-tutor-use-case';

export async function updateTutorController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateTutorBodySchema = zod.object({
    name: zod.string(),
    email: zod.string(),
    type: zod.enum(['ONG', 'PROTECTOR', 'TUTOR']),
    cnpj_cpf: zod.string(),
    manager_ong: zod.string().optional().nullable(),
    personal_phone: zod.string(),
    personal_phone_is_whatsapp: zod.boolean(),
    public_phone: zod.string().optional().nullable(),
    public_phone_is_whatsapp: zod.boolean(),
    street_name: zod.string(),
    street_number: zod.string(),
    complement: zod.string().optional().nullable(),
    neighborhood: zod.string(),
    postal_code: zod.string(),
    reference: zod.string().optional().nullable(),
    state: zod.string(),
    city: zod.string(),
  });

  const {
    name,
    email,
    type,
    cnpj_cpf,
    manager_ong,
    personal_phone,
    personal_phone_is_whatsapp,
    public_phone,
    public_phone_is_whatsapp,
    street_name,
    street_number,
    complement,
    neighborhood,
    postal_code,
    reference,
    state,
    city,
  } = updateTutorBodySchema.parse(request.body);

  const tutorId = request.user.sub;

  try {
    const updateTutorUseCase = container.resolve(UpdateTutorUseCase);

    const { tutor } = await updateTutorUseCase.execute({
      id: tutorId,
      name,
      email,
      type,
      cnpj_cpf,
      manager_ong,
      personal_phone,
      personal_phone_is_whatsapp,
      public_phone,
      public_phone_is_whatsapp,
      street_name,
      street_number,
      complement,
      neighborhood,
      postal_code,
      reference,
      state,
      city,
    });

    return reply.status(200).send(instanceToInstance({ tutor }));
  } catch (error) {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        status: 'error',
        message: error.message,
      });
    }
  }
}
