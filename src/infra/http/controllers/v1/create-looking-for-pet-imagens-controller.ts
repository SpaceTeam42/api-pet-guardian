import { FastifyReply, FastifyRequest } from 'fastify';

import { pipeline } from 'node:stream/promises';

import { z as zod } from 'zod';

import { container } from 'tsyringe';

import { instanceToInstance } from 'class-transformer';

import uploadConfig from '@config/upload';

import { AppError } from '@core/errors/AppError';

import { CreateLookingForPetImagesUseCase } from '@domain/pet-guardian/application/use-cases/v1/create-looking-for-pet-imagens-use-case';

export async function createLookingForPetImagesController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createLookingForPetImagesRouteParamsSchema = zod.object({
    id: zod.string().uuid(),
  });

  const { id } = createLookingForPetImagesRouteParamsSchema.parse(
    request.params,
  );

  try {
    const images = request.files();

    const createLookingForPetImagesUseCase = container.resolve(
      CreateLookingForPetImagesUseCase,
    );

    const imagesFilename: string[] = [];

    for await (const image of images) {
      const { createWriteStream, fileNameHash } = uploadConfig.createFileUpload(
        image.filename,
      );

      await pipeline(image.file, createWriteStream);

      imagesFilename.push(fileNameHash);
    }

    const { lookingForPetImages } =
      await createLookingForPetImagesUseCase.execute({
        id,
        images: imagesFilename,
      });

    return reply
      .status(201)
      .send(instanceToInstance({ images: lookingForPetImages }));
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
