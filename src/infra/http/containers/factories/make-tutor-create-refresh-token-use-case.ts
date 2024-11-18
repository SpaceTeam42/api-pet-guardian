import { FastifyReply } from 'fastify';

import { JwtEncrypter } from '@infra/cryptography/jwt-encrypter';

import { TutorsRefreshesTokensRepository } from '@infra/database/repositories/typeorm/typeorm-tutors-refreshes-tokens-repository';

import { CreateTutorRefreshTokenUseCase } from '@domain/pet-guardian/application/use-cases/v1/create-tutor-refresh-token-use-case';

export function makeCreateTutorRefreshTokenUseCase(reply: FastifyReply) {
  const tutorsRefreshesTokensRepository = new TutorsRefreshesTokensRepository();

  const encrypter = new JwtEncrypter(reply);

  const createTutorRefreshTokenUseCase = new CreateTutorRefreshTokenUseCase(
    encrypter,
    tutorsRefreshesTokensRepository,
  );

  return createTutorRefreshTokenUseCase;
}
