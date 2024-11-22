import { FastifyReply, FastifyRequest } from 'fastify';

import { AppError } from '@core/errors/AppError';

import { TutorsRepository } from '@infra/database/repositories/typeorm/typeorm-tutors-repository';

export async function ensuredTutorAuthenticated(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const tutorId = request.user.sub;

    const tutorsRepository = new TutorsRepository();

    const tutor = await tutorsRepository.findById(tutorId);

    if (!tutor || tutor.enabled === false) {
      throw new AppError('Unauthorized!', 401);
    }
  } catch (error) {
    return reply.status(401).send({ error: 'Unauthorized!' });
  }
}
