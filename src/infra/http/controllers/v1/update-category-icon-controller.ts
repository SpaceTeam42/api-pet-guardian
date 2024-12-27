import { FastifyReply, FastifyRequest } from 'fastify';

import { pipeline } from 'node:stream/promises';

import { z as zod } from 'zod';

import { container } from 'tsyringe';

import { instanceToInstance } from 'class-transformer';

import uploadConfig from '@config/upload';

import { AppError } from '@core/errors/AppError';

import { UpdateCategoryIconUseCase } from '@domain/pet-guardian/application/use-cases/v1/update-categoy-icon-use-case';

export async function updateCategoryIconController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateCategoryIconRouteParams = zod.object({
    id: zod.string().uuid(),
  });

  const { id } = updateCategoryIconRouteParams.parse(request.params);

  try {
    const fileData = await request.file();

    const { createWriteStream, fileNameHash: fileNameFormatted } =
      uploadConfig.createFileUpload(fileData.filename);

    await pipeline(fileData.file, createWriteStream);

    const updateCategoryIconUseCase = container.resolve(
      UpdateCategoryIconUseCase,
    );

    const { category } = await updateCategoryIconUseCase.execute({
      id,
      iconFilename: fileNameFormatted,
    });

    return reply.status(200).send(instanceToInstance({ category }));
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
