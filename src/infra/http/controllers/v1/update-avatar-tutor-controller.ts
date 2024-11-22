import { FastifyReply, FastifyRequest } from 'fastify';

import { File } from 'fastify-multer/lib/interfaces';

import { container } from 'tsyringe';

import { instanceToInstance } from 'class-transformer';

import { AppError } from '@core/errors/AppError';

import { UpdateAvatarTutorUseCase } from '@domain/pet-guardian/application/use-cases/v1/update-avatar-tutor-use-case';

declare module 'fastify' {
  interface FastifyRequest {
    file: File;
  }
}

export async function updateAvatarTutorController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { sub } = request.user;
    const avatarFilename = request.file.filename;

    const tutorId = sub;

    const updateAvatarTutorUseCase = container.resolve(
      UpdateAvatarTutorUseCase,
    );

    const { tutor } = await updateAvatarTutorUseCase.execute({
      id: tutorId,
      avatarFilename,
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
