import { FastifyReply } from 'fastify';

import { JwtEncrypter } from '@infra/cryptography/jwt-encrypter';

import { WriterRefreshTokensRepository } from '@infra/database/repositories/typeorm/typeorm-writer-refresh-tokens-repository';
import { CreateWriterRefreshTokenUseCase } from '@domain/pet-guardian/application/use-cases/v1/create-writer-refresh-token-use-case';

export function makeCreateWriterRefreshTokenUseCase(reply: FastifyReply) {
  const writerRefreshTokensRepository = new WriterRefreshTokensRepository();

  const encrypter = new JwtEncrypter(reply);

  const createTutorRefreshTokenUseCase = new CreateWriterRefreshTokenUseCase(
    encrypter,
    writerRefreshTokensRepository,
  );

  return createTutorRefreshTokenUseCase;
}
