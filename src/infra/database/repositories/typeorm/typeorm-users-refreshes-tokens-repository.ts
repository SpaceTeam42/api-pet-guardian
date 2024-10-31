import { Repository } from 'typeorm';

import { postgresDataSource } from '@infra/database/typeorm/connections/postgres-connection';

import { ICreateUserRefreshTokenDTO } from '@domain/pet-guardian/application/dtos/create-user-refresh-token-dto';
import { IUsersRefreshesTokensRepository } from '@domain/pet-guardian/application/repositories/v1/users-refreshes-tokens-repository';
import { UserRefreshToken } from '@infra/database/typeorm/entities/UserRefreshToken';

class UsersRefreshesTokensRepository
  implements IUsersRefreshesTokensRepository
{
  private ormRepository: Repository<UserRefreshToken>;

  constructor() {
    this.ormRepository = postgresDataSource.getRepository(UserRefreshToken);
  }

  public async create({
    refresh_token,
    user_id,
    expires_date,
  }: ICreateUserRefreshTokenDTO): Promise<UserRefreshToken> {
    const userRefreshToken = this.ormRepository.create({
      refresh_token,
      user_id,
      expires_date,
    });

    await this.ormRepository.save(userRefreshToken);

    return userRefreshToken;
  }

  public async findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string,
  ): Promise<UserRefreshToken | null> {
    return this.ormRepository.findOne({ where: { refresh_token, user_id } });
  }

  public async findByRefreshToken(
    refresh_token: string,
  ): Promise<UserRefreshToken | null> {
    return this.ormRepository.findOne({ where: { refresh_token } });
  }

  public async deleteById(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}

export { UsersRefreshesTokensRepository };
