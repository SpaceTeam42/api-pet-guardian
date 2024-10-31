import { UserRefreshToken } from '@infra/database/typeorm/entities/UserRefreshToken';
import { ICreateUserRefreshTokenDTO } from '@domain/pet-guardian/application/dtos/create-user-refresh-token-dto';

interface IUsersRefreshesTokensRepository {
  create({
    refresh_token,
    user_id,
    expires_date,
  }: ICreateUserRefreshTokenDTO): Promise<UserRefreshToken>;
  findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string,
  ): Promise<UserRefreshToken | null>;
  findByRefreshToken(refresh_token: string): Promise<UserRefreshToken | null>;
  deleteById(id: string): Promise<void>;
}

export { IUsersRefreshesTokensRepository };
