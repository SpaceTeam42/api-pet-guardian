import { addDays } from 'date-fns';

import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';

import { env } from '@infra/env';

import { AppError } from '@core/errors/AppError';

import { IUsersRefreshesTokensRepository } from '../../repositories/v1/users-refreshes-tokens-repository';
import { Encrypter } from '../../cryptography/encrypter';

type IPayload = {
  sub: string;
};

type IRequest = {
  refreshToken: string;
};

type IResponse = {
  token: string;
  refresh_token: string;
};

export class CreateUserRefreshTokenUseCase {
  constructor(
    private encrypter: Encrypter,
    private userRefreshTokensRepository: IUsersRefreshesTokensRepository,
  ) {}

  async execute({ refreshToken }: IRequest): Promise<IResponse> {
    const { sub } = verify(
      refreshToken,
      Buffer.from(env.JWT_PRIVATE_KEY, 'base64'),
      {
        algorithms: ['RS256'],
      },
    ) as IPayload;

    const userId = sub;

    const userRefreshToken =
      await this.userRefreshTokensRepository.findByUserIdAndRefreshToken(
        userId,
        refreshToken,
      );

    if (!userRefreshToken) {
      throw new AppError('Refresh Token does not exists!', 404);
    }

    await this.userRefreshTokensRepository.deleteById(userRefreshToken.id);

    const token = await this.encrypter.encrypt(
      userId,
      authConfig.jwt.expires_in_token,
    );

    const newRefreshToken = await this.encrypter.encrypt(
      userId,
      authConfig.jwt.expires_in_refresh_token,
    );

    const expiresDate = addDays(
      new Date(),
      authConfig.jwt.expires_refresh_token_days,
    );

    await this.userRefreshTokensRepository.create({
      refresh_token: newRefreshToken,
      user_id: userId,
      expires_date: expiresDate,
    });

    return { token, refresh_token: newRefreshToken };
  }
}
