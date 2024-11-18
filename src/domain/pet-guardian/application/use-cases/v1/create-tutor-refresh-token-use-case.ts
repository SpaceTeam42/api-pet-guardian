import { addDays } from 'date-fns';

import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';

import { env } from '@infra/env';

import { AppError } from '@core/errors/AppError';

import { Encrypter } from '../../cryptography/encrypter';

import { ITutorsRefreshesTokensRepository } from '../../repositories/v1/tutors-refreshes-tokens-repository';

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

export class CreateTutorRefreshTokenUseCase {
  constructor(
    private encrypter: Encrypter,
    private tutorRefreshTokensRepository: ITutorsRefreshesTokensRepository,
  ) {}

  async execute({ refreshToken }: IRequest): Promise<IResponse> {
    const { sub } = verify(
      refreshToken,
      Buffer.from(env.JWT_PRIVATE_KEY, 'base64'),
      {
        algorithms: ['RS256'],
      },
    ) as IPayload;

    const tutorId = sub;

    const tutorRefreshToken =
      await this.tutorRefreshTokensRepository.findByTutorIdAndRefreshToken(
        tutorId,
        refreshToken,
      );

    if (!tutorRefreshToken) {
      throw new AppError('Refresh token does not exists!', 404);
    }

    await this.tutorRefreshTokensRepository.deleteById(tutorRefreshToken.id);

    const token = await this.encrypter.encrypt(
      tutorId,
      authConfig.jwt.expires_in_token,
    );

    const newRefreshToken = await this.encrypter.encrypt(
      tutorId,
      authConfig.jwt.expires_in_refresh_token,
    );

    const expiresDate = addDays(
      new Date(),
      authConfig.jwt.expires_refresh_token_days,
    );

    await this.tutorRefreshTokensRepository.create({
      refresh_token: newRefreshToken,
      tutor_id: tutorId,
      expires_date: expiresDate,
    });

    return { token, refresh_token: newRefreshToken };
  }
}
