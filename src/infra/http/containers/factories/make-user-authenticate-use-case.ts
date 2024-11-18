import { FastifyReply } from 'fastify';

import { BcrypterHasher } from '@infra/cryptography/bcrypter-hasher';
import { JwtEncrypter } from '@infra/cryptography/jwt-encrypter';

import { UsersRepository } from '@infra/database/repositories/typeorm/typeorm-users-repository';
import { UsersRefreshesTokensRepository } from '@infra/database/repositories/typeorm/typeorm-users-refreshes-tokens-repository';

import { AuthenticateUserUseCase } from '@domain/pet-guardian/application/use-cases/v1/authenticate-user-use-case';

export function makeAuthenticateUserUseCase(reply: FastifyReply) {
  const usersRepository = new UsersRepository();
  const usersRefreshesTokensRepository = new UsersRefreshesTokensRepository();
  const hashComparer = new BcrypterHasher();
  const encrypter = new JwtEncrypter(reply);

  const authenticateUserUseCase = new AuthenticateUserUseCase(
    usersRepository,
    usersRefreshesTokensRepository,
    hashComparer,
    encrypter,
  );

  return authenticateUserUseCase;
}
