import { FastifyReply } from 'fastify';

import { JwtEncrypter } from '@infra/cryptography/jwt-encrypter';

import { UsersRefreshesTokensRepository } from '@infra/database/repositories/typeorm/typeorm-users-refreshes-tokens-repository';

import { CreateUserRefreshTokenUseCase } from '@domain/pet-guardian/application/use-cases/v1/create-user-refresh-token-use-case';

export function makeCreateUserRefreshTokenUseCase(reply: FastifyReply) {
  const usersRefreshesTokensRepository = new UsersRefreshesTokensRepository();

  const encrypter = new JwtEncrypter(reply);

  const authenticateUseUseCase = new CreateUserRefreshTokenUseCase(
    encrypter,
    usersRefreshesTokensRepository,
  );

  return authenticateUseUseCase;
}
