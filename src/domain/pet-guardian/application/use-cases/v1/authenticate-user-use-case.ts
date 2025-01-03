import { addDays } from 'date-fns';

import { AppError } from '@core/errors/AppError';

import authConfig from '@config/auth';

import { IHashComparer } from '@domain/pet-guardian/application/cryptography/hash-comparer';
import { Encrypter } from '@domain/pet-guardian/application/cryptography/encrypter';

import { IUsersRepository } from '@domain/pet-guardian/application/repositories/v1/users-repository';
import { IUsersRefreshesTokensRepository } from '@domain/pet-guardian/application/repositories/v1/users-refreshes-tokens-repository';

import { User } from '@infra/database/typeorm/entities/User';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
  refresh_token: string;
}

export class AuthenticateUserUseCase {
  constructor(
    private usersRepository: IUsersRepository,

    private userRefreshTokensRepository: IUsersRefreshesTokensRepository,

    private hashComparer: IHashComparer,

    private encrypter: Encrypter,
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user || user.enabled === false) {
      throw new AppError('E-mail or password incorrect!', 400);
    }

    const passwordMatch = await this.hashComparer.compare(
      password,
      user.password,
    );

    if (!passwordMatch) {
      throw new AppError('E-mail or password incorrect!', 400);
    }

    const token = await this.encrypter.encrypt(
      user.id,
      authConfig.jwt.expires_in_token,
    );

    const refreshToken = await this.encrypter.encrypt(
      user.id,
      authConfig.jwt.expires_in_refresh_token,
    );

    const refreshTokenExpiresDate = addDays(
      new Date(),
      authConfig.jwt.expires_refresh_token_days,
    );

    await this.userRefreshTokensRepository.create({
      refresh_token: refreshToken,
      user_id: user.id,
      expires_date: refreshTokenExpiresDate,
    });

    return { user, token, refresh_token: refreshToken };
  }
}
