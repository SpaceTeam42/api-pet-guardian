import { UserToken } from '@infra/database/typeorm/entities/UserToken';

interface IUserTokensRepository {
  generate(user_id: string): Promise<UserToken>;
  findByToken(token: string): Promise<UserToken | null>;
}

export { IUserTokensRepository };
