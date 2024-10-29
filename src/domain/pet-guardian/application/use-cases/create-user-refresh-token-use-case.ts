import { addDays } from 'date-fns';

import authConfig from '@config/auth';

import { AppError } from '@core/errors/AppError';

import { IUsersRefreshesTokensRepository } from '../repositories/users-refreshes-tokens-repository';
import { Encrypter } from '../cryptography/encrypter';

type IRequest = {
  userId: string;
  refreshToken;
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

  async execute({ userId, refreshToken }: IRequest): Promise<IResponse> {
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
