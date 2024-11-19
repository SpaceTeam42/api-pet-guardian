import { FastifyReply, FastifyRequest } from 'fastify';

import { File } from 'fastify-multer/lib/interfaces';

import { container } from 'tsyringe';

import { z as zod } from 'zod';

import { instanceToInstance } from 'class-transformer';

import { AppError } from '@core/errors/AppError';

import { CreateTutorUseCase } from '@domain/pet-guardian/application/use-cases/v1/create-tutor-use-case';

declare module 'fastify' {
  export interface FastifyRequest {
    file: File;
  }
}

export async function createTutorController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createTutorBodySchema = zod.object({
    name: zod.string(),
    email: zod.string(),
    password: zod.string(),
    type: zod.enum(['ONG', 'PROTECTOR', 'TUTOR']),
    cnpj_cpf: zod.string(),
    manager_ong: zod.string().optional().nullable(),
    personal_phone: zod.string(),
    personal_phone_is_whatsapp: zod.boolean(),
    public_phone: zod.string().optional().nullable(),
    public_phone_is_whatsapp: zod.boolean().default(false),
    street_name: zod.string(),
    street_number: zod.string(),
    complement: zod.string().optional().nullable(),
    neighborhood: zod.string(),
    postal_code: zod.string(),
    reference: zod.string().optional().nullable(),
    state: zod.string(),
    city: zod.string(),
    enabled: zod.boolean(),
  });

  const {
    name,
    email,
    password,
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
    enabled,
  } = createTutorBodySchema.parse(request.body);

  const avatarImage = request.file.fieldname;

  try {
    const createTutorUseCase = container.resolve(CreateTutorUseCase);

    const { tutor } = await createTutorUseCase.execute({
      name,
      email,
      password,
      type,
      cnpj_cpf,
      manager_ong,
      avatar: avatarImage,
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
      enabled,
    });

    return reply.status(201).send(instanceToInstance({ tutor }));
  } catch (error) {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        status: 'error',
        message: error.message,
      });
    }
  }
}
