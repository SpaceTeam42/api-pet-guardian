import { ILike, Repository } from 'typeorm';

import { postgresDataSource } from '@infra/database/typeorm/connections/postgres-connection';

import { ICreateWriterDTO } from '@domain/pet-guardian/application/dtos/create-writer-dto';
import { IFindManyWritersParametersDTO } from '@domain/pet-guardian/application/dtos/find-many-writers-parameters-dto';
import { IFindManyWritersResponseDTO } from '@domain/pet-guardian/application/dtos/find-many-writers-response-dto';

import { IWritersRepository } from '@domain/pet-guardian/application/repositories/v1/writers-repository';

import { Writer } from '@infra/database/typeorm/entities/Writer';

export class WritersRepository implements IWritersRepository {
  private ormRepository: Repository<Writer>;

  constructor() {
    this.ormRepository = postgresDataSource.getRepository(Writer);
  }

  async create({
    name,
    email,
    password,
    instagram,
  }: ICreateWriterDTO): Promise<Writer> {
    const writer = this.ormRepository.create({
      name,
      email,
      password,
      instagram,
    });

    await this.ormRepository.save(writer);

    return writer;
  }

  async findMany({
    searchAndPageParams: { searchParam, page, perPage },
    enabled,
  }: IFindManyWritersParametersDTO): Promise<IFindManyWritersResponseDTO> {
    let totalWriters = 0;
    let writers: Writer[];

    // ILIKE - case-insensitive
    // LIKE - case-sensitive

    if (searchParam) {
      const countNews = await this.ormRepository.count({
        where: {
          // id: Not(authenticateTutorId),
          name: ILike(`%${searchParam}%`),
          enabled: enabled === 'true',
        },
      });

      totalWriters = countNews;

      if (page) {
        const tutorsNews = await this.ormRepository.find({
          where: {
            // id: Not(authenticateTutorId),
            name: ILike(`%${searchParam}%`),
            enabled: enabled === 'true',
          },
          // quantos itens queremos pular
          skip: (Number(page) - 1) * Number(perPage),
          // quantos itens queremos
          take: Number(perPage),
          order: {
            name: 'ASC',
          },
        });

        writers = tutorsNews;
      } else {
        const tutorsNews = await this.ormRepository.find({
          where: {
            // id: Not(authenticateTutorId),
            name: ILike(`%${searchParam}%`),
            enabled: enabled === 'true',
          },
          order: {
            name: 'ASC',
          },
        });

        writers = tutorsNews;
      }
    } else {
      const countNews = await this.ormRepository.count({
        where: {
          // id: Not(authenticateTutorId),
          enabled: enabled === 'true',
        },
      });

      totalWriters = countNews;

      if (page) {
        const tutorsNews = await this.ormRepository.find({
          where: {
            // id: Not(authenticateTutorId),
            enabled: enabled === 'true',
          },
          // quantos itens queremos pular
          skip: (Number(page) - 1) * Number(perPage),
          // quantos itens queremos
          take: Number(perPage),
          order: {
            name: 'ASC',
          },
        });

        writers = tutorsNews;
      } else {
        const tutorsNews = await this.ormRepository.find({
          where: {
            // id: Not(authenticateTutorId),
            enabled: enabled === 'true',
          },
          order: {
            name: 'ASC',
          },
        });

        writers = tutorsNews;
      }
    }

    return { writers, totalWriters };
  }

  async findById(id: string): Promise<Writer | undefined> {
    return this.ormRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<Writer | undefined> {
    return this.ormRepository.findOne({ where: { email } });
  }

  async save(writer: Writer): Promise<Writer> {
    return this.ormRepository.save(writer);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}
