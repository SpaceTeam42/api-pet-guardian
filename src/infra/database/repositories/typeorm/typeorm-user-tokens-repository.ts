import { Repository } from 'typeorm';

import { postgresDataSource } from '@infra/database/typeorm/connections/postgres-connection';

import { IUserTokensRepository } from '@domain/pet-guardian/application/repositories/user-tokens-repository';

import { UserToken } from '@infra/database/typeorm/entities/UserToken';

export class UserTokensRepository implements IUserTokensRepository {
  private ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = postgresDataSource.getRepository(UserToken);
  }

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = this.ormRepository.create({ user_id });

    await this.ormRepository.save(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | null> {
    return this.ormRepository.findOne({ where: { token } });
  }
}
