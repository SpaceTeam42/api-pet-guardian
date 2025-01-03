import { Repository } from 'typeorm';

import { postgresDataSource } from '@infra/database/typeorm/connections/postgres-connection';

import { ICreateWriterRefreshTokenDTO } from '@domain/pet-guardian/application/dtos/create-writer-refresh-token-dto';
import { IWriterRefreshTokensRepository } from '@domain/pet-guardian/application/repositories/v1/writer-refresh-tokens-repository';

import { WriterRefreshToken } from '@infra/database/typeorm/entities/WriterRefreshToken';

export class WriterRefreshTokensRepository
  implements IWriterRefreshTokensRepository
{
  private ormRepository: Repository<WriterRefreshToken>;

  constructor() {
    this.ormRepository = postgresDataSource.getRepository(WriterRefreshToken);
  }

  async create({
    refresh_token,
    writer_id,
    expires_date,
  }: ICreateWriterRefreshTokenDTO): Promise<WriterRefreshToken> {
    const tutorRefreshToken = this.ormRepository.create({
      refresh_token,
      writer_id,
      expires_date,
    });

    await this.ormRepository.save(tutorRefreshToken);

    return tutorRefreshToken;
  }

  async findByWriterIdAndRefreshToken(
    writer_id: string,
    refresh_token: string,
  ): Promise<WriterRefreshToken | undefined> {
    return this.ormRepository.findOne({ where: { writer_id, refresh_token } });
  }

  async findByRefreshToken(
    refresh_token: string,
  ): Promise<WriterRefreshToken | undefined> {
    return this.ormRepository.findOne({ where: { refresh_token } });
  }

  async deleteById(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}
