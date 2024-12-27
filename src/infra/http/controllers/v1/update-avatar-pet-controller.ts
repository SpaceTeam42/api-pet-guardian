import { FastifyReply, FastifyRequest } from 'fastify';

import { pipeline } from 'node:stream/promises';

import { z as zod } from 'zod';

import { container } from 'tsyringe';

import { instanceToInstance } from 'class-transformer';

import uploadConfig from '@config/upload';

import { AppError } from '@core/errors/AppError';

import { UpdateAvatarPetUseCase } from '@domain/pet-guardian/application/use-cases/v1/update-avatar-pet-use-case';

export async function updateAvatarPetController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateAvatarPetRouteParamsSchema = zod.object({
    id: zod.string().uuid(),
  });

  const { id } = updateAvatarPetRouteParamsSchema.parse(request.params);

  try {
    const fileData = await request.file();

    const { createWriteStream, fileNameHash } = uploadConfig.createFileUpload(
      fileData.filename,
    );

    await pipeline(fileData.file, createWriteStream);

    const updateAvatarPetUseCase = container.resolve(UpdateAvatarPetUseCase);

    const { pet } = await updateAvatarPetUseCase.execute({
      id,
      avatarFilename: fileNameHash,
    });

    return reply.status(200).send(instanceToInstance({ pet }));
  } catch (error) {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        status: 'error',
        message: error.message,
      });
    }

    throw error;
  }
}
