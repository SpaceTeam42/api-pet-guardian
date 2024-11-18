import { Repository } from 'typeorm';
import { postgresDataSource } from '@infra/database/typeorm/connections/postgres-connection';

import { ICreateTutorRefreshTokenDTO } from '@domain/pet-guardian/application/dtos/create-tutor-refresh-token-dto';
import { ITutorsRefreshesTokensRepository } from '@domain/pet-guardian/application/repositories/v1/tutors-refreshes-tokens-repository';
import { TutorRefreshToken } from '@infra/database/typeorm/entities/TutorRefreshToken';

export class TutorsRefreshesTokensRepository
  implements ITutorsRefreshesTokensRepository
{
  private ormRepository: Repository<TutorRefreshToken>;

  constructor() {
    this.ormRepository = postgresDataSource.getRepository(TutorRefreshToken);
  }

  public async create({
    refresh_token,
    tutor_id,
    expires_date,
  }: ICreateTutorRefreshTokenDTO): Promise<TutorRefreshToken> {
    const tutorRefreshToken = this.ormRepository.create({
      refresh_token,
      tutor_id,
      expires_date,
    });

    await this.ormRepository.save(tutorRefreshToken);

    return tutorRefreshToken;
  }

  public async findByTutorIdAndRefreshToken(
    tutor_id: string,
    refresh_token: string,
  ): Promise<TutorRefreshToken | null> {
    return this.ormRepository.findOne({ where: { tutor_id, refresh_token } });
  }

  public async findByRefreshToken(
    refresh_token: string,
  ): Promise<TutorRefreshToken | null> {
    return this.ormRepository.findOne({ where: { refresh_token } });
  }

  public async deleteById(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}
