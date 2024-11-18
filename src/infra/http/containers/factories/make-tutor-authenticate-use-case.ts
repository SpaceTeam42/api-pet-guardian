import { FastifyReply } from 'fastify';

import { BcrypterHasher } from '@infra/cryptography/bcrypter-hasher';
import { JwtEncrypter } from '@infra/cryptography/jwt-encrypter';

import { TutorsRepository } from '@infra/database/repositories/typeorm/typeorm-tutors-repository';
import { TutorsRefreshesTokensRepository } from '@infra/database/repositories/typeorm/typeorm-tutors-refreshes-tokens-repository';

import { AuthenticateTutorUseCase } from '@domain/pet-guardian/application/use-cases/v1/authenticate-tutor-use-case';

export function makeAuthenticateTutorUseCase(reply: FastifyReply) {
  const tutorsRepository = new TutorsRepository();
  const tutorsRefreshesTokensRepository = new TutorsRefreshesTokensRepository();
  const hashComparer = new BcrypterHasher();
  const encrypter = new JwtEncrypter(reply);

  const authenticateTutorUseCase = new AuthenticateTutorUseCase(
    tutorsRepository,
    tutorsRefreshesTokensRepository,
    hashComparer,
    encrypter,
  );

  return authenticateTutorUseCase;
}
