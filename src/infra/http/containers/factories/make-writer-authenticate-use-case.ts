import { FastifyReply } from 'fastify';

import { BcrypterHasher } from '@infra/cryptography/bcrypter-hasher';
import { JwtEncrypter } from '@infra/cryptography/jwt-encrypter';

import { WritersRepository } from '@infra/database/repositories/typeorm/typeorm-writers-repository';
import { WriterRefreshTokensRepository } from '@infra/database/repositories/typeorm/typeorm-writer-refresh-tokens-repository';

import { AuthenticateWriterUseCase } from '@domain/pet-guardian/application/use-cases/v1/authenticate-writer-use-case';

export function makeAuthenticateWriterUseCase(reply: FastifyReply) {
  const writersRepository = new WritersRepository();
  const writerRefreshTokensRepository = new WriterRefreshTokensRepository();
  const hashComparer = new BcrypterHasher();
  const encrypter = new JwtEncrypter(reply);

  const authenticateWriterUseCase = new AuthenticateWriterUseCase(
    writersRepository,
    writerRefreshTokensRepository,
    hashComparer,
    encrypter,
  );

  return authenticateWriterUseCase;
}
