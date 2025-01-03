import { addDays } from 'date-fns';

import authConfig from '@config/auth';

import { AppError } from '@core/errors/AppError';

import { IHashComparer } from '@domain/pet-guardian/application/cryptography/hash-comparer';
import { Encrypter } from '@domain/pet-guardian/application/cryptography/encrypter';

import { Writer } from '@infra/database/typeorm/entities/Writer';
import { IWritersRepository } from '../../repositories/v1/writers-repository';
import { IWriterRefreshTokensRepository } from '../../repositories/v1/writer-refresh-tokens-repository';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  writer: Writer;
  token: string;
  refresh_token: string;
}

export class AuthenticateWriterUseCase {
  constructor(
    private writersRepository: IWritersRepository,

    private writerRefreshTokensRepository: IWriterRefreshTokensRepository,

    private hashComparer: IHashComparer,

    private encrypter: Encrypter,
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const writer = await this.writersRepository.findByEmail(email);

    if (!writer || writer.enabled === false) {
      throw new AppError('E-mail or password incorrect!', 400);
    }

    const passwordMatch = await this.hashComparer.compare(
      password,
      writer.password,
    );

    if (!passwordMatch) {
      throw new AppError('E-mail or password incorrect!', 400);
    }

    const token = await this.encrypter.encrypt(
      writer.id,
      authConfig.jwt.expires_in_token,
    );

    const refreshToken = await this.encrypter.encrypt(
      writer.id,
      authConfig.jwt.expires_in_refresh_token,
    );

    const refreshTokenExpiresDate = addDays(
      new Date(),
      authConfig.jwt.expires_refresh_token_days,
    );

    await this.writerRefreshTokensRepository.create({
      refresh_token: refreshToken,
      writer_id: writer.id,
      expires_date: refreshTokenExpiresDate,
    });

    return { writer, token, refresh_token: refreshToken };
  }
}
