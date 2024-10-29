import { inject, injectable } from 'tsyringe';

import { addDays } from 'date-fns';

import { AppError } from '@core/errors/AppError';

import authConfig from '@config/auth';

import { IHashComparer } from '../cryptography/hash-comparer';
import { Encrypter } from '../cryptography/encrypter';

import { IUsersRepository } from '../repositories/users-repository';
import { IUsersRefreshesTokensRepository } from '../repositories/users-refreshes-tokens-repository';

import { User } from '@infra/database/typeorm/entities/User';

type IRequest = {
  email: string;
  password: string;
};

type IResponse = {
  user: User;
  token: string;
  refresh_token: string;
};

@injectable()
export class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UsersRefreshesTokensRepository')
    private userRefreshTokensRepository: IUsersRefreshesTokensRepository,

    @inject('HashComparerProvider')
    private hashComparer: IHashComparer,

    @inject('EncrypterProvider')
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
      user.id!,
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
