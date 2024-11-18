import { addDays } from 'date-fns';

import { AppError } from '@core/errors/AppError';

import authConfig from '@config/auth';

import { IHashComparer } from '@domain/pet-guardian/application/cryptography/hash-comparer';
import { Encrypter } from '@domain/pet-guardian/application/cryptography/encrypter';

import { ITutorsRepository } from '../../repositories/v1/tutors-repository';
import { ITutorsRefreshesTokensRepository } from '../../repositories/v1/tutors-refreshes-tokens-repository';

import { Tutor } from '@infra/database/typeorm/entities/Tutor';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  tutor: Tutor;
  token: string;
  refresh_token: string;
}

export class AuthenticateTutorUseCase {
  constructor(
    private tutorsRepository: ITutorsRepository,

    private tutorRefreshTokensRepository: ITutorsRefreshesTokensRepository,

    private hashComparer: IHashComparer,

    private encrypter: Encrypter,
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const tutor = await this.tutorsRepository.findByEmail(email);

    if (!tutor || tutor.enabled === false) {
      throw new AppError('E-mail or password incorrect!', 400);
    }

    const passwordMatch = await this.hashComparer.compare(
      password,
      tutor.password,
    );

    if (!passwordMatch) {
      throw new AppError('E-mail or password incorrect!', 400);
    }

    const token = await this.encrypter.encrypt(
      tutor.id,
      authConfig.jwt.expires_in_token,
    );

    const refreshToken = await this.encrypter.encrypt(
      tutor.id,
      authConfig.jwt.expires_in_refresh_token,
    );

    const refreshTokenExpiresDate = addDays(
      new Date(),
      authConfig.jwt.expires_refresh_token_days,
    );

    await this.tutorRefreshTokensRepository.create({
      refresh_token: refreshToken,
      tutor_id: tutor.id,
      expires_date: refreshTokenExpiresDate,
    });

    return { tutor, token, refresh_token: refreshToken };
  }
}
