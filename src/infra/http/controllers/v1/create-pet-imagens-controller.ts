import { FastifyReply, FastifyRequest } from 'fastify';

import { pipeline } from 'node:stream/promises';

import { z as zod } from 'zod';

import { container } from 'tsyringe';

import { instanceToInstance } from 'class-transformer';

import uploadConfig from '@config/upload';

import { AppError } from '@core/errors/AppError';

import { CreatePetImagesUseCase } from '@domain/pet-guardian/application/use-cases/v1/create-pet-imagens-use-case';

export async function createPetImagesController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createPetImagesRouteParamsSchema = zod.object({
    id: zod.string().uuid(),
  });

  const { id } = createPetImagesRouteParamsSchema.parse(request.params);

  try {
    const images = request.files();

    const createPetImagesUseCase = container.resolve(CreatePetImagesUseCase);

    const imagesFilename: string[] = [];

    for await (const image of images) {
      const { createWriteStream, fileNameHash } = uploadConfig.createFileUpload(
        image.filename,
      );

      await pipeline(image.file, createWriteStream);

      imagesFilename.push(fileNameHash);
    }

    const { petImages } = await createPetImagesUseCase.execute({
      id,
      images: imagesFilename,
    });

    return reply.status(201).send(instanceToInstance({ images: petImages }));
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
