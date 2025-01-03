import { ICreateWriterRefreshTokenDTO } from '../../dtos/create-writer-refresh-token-dto';

import { WriterRefreshToken } from '@infra/database/typeorm/entities/WriterRefreshToken';

export interface IWriterRefreshTokensRepository {
  create({
    refresh_token,
    writer_id,
    expires_date,
  }: ICreateWriterRefreshTokenDTO): Promise<WriterRefreshToken>;
  findByWriterIdAndRefreshToken(
    writer_id: string,
    refresh_token: string,
  ): Promise<WriterRefreshToken | undefined>;
  findByRefreshToken(
    refresh_token: string,
  ): Promise<WriterRefreshToken | undefined>;
  deleteById(id: string): Promise<void>;
}
