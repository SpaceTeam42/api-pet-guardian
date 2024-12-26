import { FastifyReply, FastifyRequest } from 'fastify';

import { z as zod } from 'zod';

import { container } from 'tsyringe';

import { instanceToInstance } from 'class-transformer';

import { CreateLookingForPetImagesUseCase } from '@domain/pet-guardian/application/use-cases/v1/create-looking-for-pet-imagens-use-case';

export async function createLookingForPetImagesController(
  request: FastifyRequest,
  reply: FastifyReply,
) {}
