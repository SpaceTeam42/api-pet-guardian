import { ILike, ObjectId, Repository } from 'typeorm';

import { mongoDataSource } from '@infra/database/typeorm/connections/mongodb-connetion';

import { ICreateNewsDTO } from '@domain/pet-guardian/application/dtos/create-news-dto';
import { IFindManyNewsParametersDTO } from '@domain/pet-guardian/application/dtos/find-many-news-parameters-dto';
import { IFindManyNewsResponseDTO } from '@domain/pet-guardian/application/dtos/find-many-news-response-dto';
import { IFindManyNewsWriterParametersDTO } from '@domain/pet-guardian/application/dtos/find-many-news-writer-parameters-dto';

import { INewsRepository } from '@domain/pet-guardian/application/repositories/v1/news-repository';

import { News } from '@infra/database/typeorm/schemas/News';

export class NewsRepository implements INewsRepository {
  private ormRepository: Repository<News>;

  constructor() {
    this.ormRepository = mongoDataSource.getMongoRepository(News);
  }

  async create({
    title,
    description,
    content,
    writer_id,
    image,
    enabled,
  }: ICreateNewsDTO): Promise<News> {
    const news = this.ormRepository.create({
      title,
      description,
      content,
      writer_id,
      image,
      enabled,
    });

    await this.ormRepository.save(news);

    return news;
  }

  async findMany({
    searchAndPageParams: { searchParam, page, perPage },
    enabled,
  }: IFindManyNewsParametersDTO): Promise<IFindManyNewsResponseDTO> {
    let totalNews = 0;
    let news: News[];

    // ILIKE - case-insensitive
    // LIKE - case-sensitive

    if (searchParam) {
      const countNews = await this.ormRepository.count({
        where: {
          // id: Not(authenticateTutorId),
          title: ILike(`%${searchParam}%`),
          enabled: enabled === 'true',
        },
      });

      totalNews = countNews;

      if (page) {
        const tutorsNews = await this.ormRepository.find({
          where: {
            // id: Not(authenticateTutorId),
            title: ILike(`%${searchParam}%`),
            enabled: enabled === 'true',
          },
          // quantos itens queremos pular
          skip: (Number(page) - 1) * Number(perPage),
          // quantos itens queremos
          take: Number(perPage),
          order: {
            title: 'ASC',
          },
        });

        news = tutorsNews;
      } else {
        const tutorsNews = await this.ormRepository.find({
          where: {
            // id: Not(authenticateTutorId),
            title: ILike(`%${searchParam}%`),
            enabled: enabled === 'true',
          },
          order: {
            title: 'ASC',
          },
        });

        news = tutorsNews;
      }
    } else {
      const countNews = await this.ormRepository.count({
        where: {
          // id: Not(authenticateTutorId),
          enabled: enabled === 'true',
        },
      });

      totalNews = countNews;

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
            title: 'ASC',
          },
        });

        news = tutorsNews;
      } else {
        const tutorsNews = await this.ormRepository.find({
          where: {
            // id: Not(authenticateTutorId),
            enabled: enabled === 'true',
          },
          order: {
            title: 'ASC',
          },
        });

        news = tutorsNews;
      }
    }

    return { news, totalNews };
  }

  async findById(id: string): Promise<News | undefined> {
    return this.ormRepository.findOne({ where: { id } });
  }

  async findManyByWriterId({
    writerId,
    searchAndPageParams: { searchParam, page, perPage },
    enabled,
  }: IFindManyNewsWriterParametersDTO): Promise<IFindManyNewsResponseDTO> {
    let totalNews = 0;
    let news: News[];

    // ILIKE - case-insensitive
    // LIKE - case-sensitive

    if (searchParam) {
      const countNews = await this.ormRepository.count({
        where: {
          // id: Not(authenticateTutorId),
          title: ILike(`%${searchParam}%`),
          writer_id: writerId,
          enabled: enabled === 'true',
        },
      });

      totalNews = countNews;

      if (page) {
        const tutorsNews = await this.ormRepository.find({
          where: {
            // id: Not(authenticateTutorId),
            title: ILike(`%${searchParam}%`),
            writer_id: writerId,
            enabled: enabled === 'true',
          },
          // quantos itens queremos pular
          skip: (Number(page) - 1) * Number(perPage),
          // quantos itens queremos
          take: Number(perPage),
          order: {
            title: 'ASC',
          },
        });

        news = tutorsNews;
      } else {
        const tutorsNews = await this.ormRepository.find({
          where: {
            // id: Not(authenticateTutorId),
            title: ILike(`%${searchParam}%`),
            writer_id: writerId,
            enabled: enabled === 'true',
          },
          order: {
            title: 'ASC',
          },
        });

        news = tutorsNews;
      }
    } else {
      const countNews = await this.ormRepository.count({
        where: {
          // id: Not(authenticateTutorId),
          writer_id: writerId,
          enabled: enabled === 'true',
        },
      });

      totalNews = countNews;

      if (page) {
        const tutorsNews = await this.ormRepository.find({
          where: {
            // id: Not(authenticateTutorId),
            writer_id: writerId,
            enabled: enabled === 'true',
          },
          // quantos itens queremos pular
          skip: (Number(page) - 1) * Number(perPage),
          // quantos itens queremos
          take: Number(perPage),
          order: {
            title: 'ASC',
          },
        });

        news = tutorsNews;
      } else {
        const tutorsNews = await this.ormRepository.find({
          where: {
            // id: Not(authenticateTutorId),
            writer_id: writerId,
            enabled: enabled === 'true',
          },
          order: {
            title: 'ASC',
          },
        });

        news = tutorsNews;
      }
    }

    return { news, totalNews };
  }

  async save(news: News): Promise<News> {
    return this.ormRepository.save(news);
  }

  async delete(id: ObjectId): Promise<void> {
    await this.ormRepository.delete(id);
  }
}
