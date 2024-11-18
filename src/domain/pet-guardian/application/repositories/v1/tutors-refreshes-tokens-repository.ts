import { ICreateTutorRefreshTokenDTO } from '../../dtos/create-tutor-refresh-token-dto';
import { TutorRefreshToken } from '@infra/database/typeorm/entities/TutorRefreshToken';

export interface ITutorsRefreshesTokensRepository {
  create({
    refresh_token,
    tutor_id,
    expires_date,
  }: ICreateTutorRefreshTokenDTO): Promise<TutorRefreshToken>;
  findByTutorIdAndRefreshToken(
    tutor_id: string,
    refresh_token: string,
  ): Promise<TutorRefreshToken | null>;
  findByRefreshToken(refresh_token: string): Promise<TutorRefreshToken | null>;
  deleteById(id: string): Promise<void>;
}
