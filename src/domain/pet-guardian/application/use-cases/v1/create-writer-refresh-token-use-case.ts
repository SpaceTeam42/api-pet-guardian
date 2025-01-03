import { addDays } from 'date-fns';

import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';

import { env } from '@infra/env';

import { AppError } from '@core/errors/AppError';

import { Encrypter } from '../../cryptography/encrypter';

import { IWriterRefreshTokensRepository } from '../../repositories/v1/writer-refresh-tokens-repository';

interface IPayload {
  sub: string;
}

interface IRequest {
  refreshToken: string;
}

interface IResponse {
  token: string;
  refresh_token: string;
}

export class CreateWriterRefreshTokenUseCase {
  constructor(
    private encrypter: Encrypter,
    private writerRefreshTokensRepository: IWriterRefreshTokensRepository,
  ) {}

  async execute({ refreshToken }: IRequest): Promise<IResponse> {
    const { sub } = verify(
      refreshToken,
      Buffer.from(env.JWT_PRIVATE_KEY, 'base64'),
      {
        algorithms: ['RS256'],
      },
    ) as IPayload;

    const writerId = sub;

    const writerRefreshToken =
      await this.writerRefreshTokensRepository.findByWriterIdAndRefreshToken(
        writerId,
        refreshToken,
      );

    if (!writerRefreshToken) {
      throw new AppError('Refresh token does not exists!', 404);
    }

    await this.writerRefreshTokensRepository.deleteById(writerRefreshToken.id);

    const token = await this.encrypter.encrypt(
      writerId,
      authConfig.jwt.expires_in_token,
    );

    const newRefreshToken = await this.encrypter.encrypt(
      writerId,
      authConfig.jwt.expires_in_refresh_token,
    );

    const expiresDate = addDays(
      new Date(),
      authConfig.jwt.expires_refresh_token_days,
    );

    await this.writerRefreshTokensRepository.create({
      refresh_token: newRefreshToken,
      writer_id: writerId,
      expires_date: expiresDate,
    });

    return { token, refresh_token: newRefreshToken };
  }
}
