import { ILike, Repository } from 'typeorm';

import { postgresDataSource } from '@infra/database/typeorm/connections/postgres-connection';

import { Category } from '@infra/database/typeorm/entities/Category';

import { ICreateCategoryDTO } from '@domain/pet-guardian/application/dtos/create-category-dto';

import { ICategoriesRepository } from '@domain/pet-guardian/application/repositories/v1/categories-repository';
import { IFindManyCategoriesParametersDTO } from '@domain/pet-guardian/application/dtos/find-many-categories-parameters-dto';
import { IFindManyCategoriesResponseDTO } from '@domain/pet-guardian/application/dtos/find-many-categories-response-dto';

export class CategoriesRepository implements ICategoriesRepository {
  private ormRepository: Repository<Category>;

  constructor() {
    this.ormRepository = postgresDataSource.getRepository(Category);
  }

  async create({ name }: ICreateCategoryDTO): Promise<Category> {
    const category = this.ormRepository.create({ name });

    await this.ormRepository.save(category);

    return category;
  }

  async findAll({
    searchAndPageParams: { searchParam, page, perPage },
    enabled,
  }: IFindManyCategoriesParametersDTO): Promise<IFindManyCategoriesResponseDTO> {
    let totalCategories = 0;
    let categories: Category[];

    // ILIKE - case-insensitive
    // LIKE - case-sensitive

    if (searchParam) {
      const countCategories = await this.ormRepository.count({
        where: {
          name: ILike(`%${searchParam}%`),
          enabled: enabled === 'true',
        },
      });

      totalCategories = countCategories;

      if (page) {
        const categoriesFind = await this.ormRepository.find({
          where: {
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

        categories = categoriesFind;
      } else {
        const categoriesFind = await this.ormRepository.find({
          where: {
            name: ILike(`%${searchParam}%`),
            enabled: enabled === 'true',
          },
          order: {
            name: 'ASC',
          },
        });

        categories = categoriesFind;
      }
    } else {
      const countCategories = await this.ormRepository.count({
        where: {
          enabled: enabled === 'true',
        },
      });

      totalCategories = countCategories;

      if (page) {
        const categoriesFind = await this.ormRepository.find({
          where: {
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

        categories = categoriesFind;
      } else {
        const categoriesFind = await this.ormRepository.find({
          where: {
            enabled: enabled === 'true',
          },

          order: {
            name: 'ASC',
          },
        });

        categories = categoriesFind;
      }
    }

    return { categories, totalCategories };
  }

  async findByName(name: string): Promise<Category | undefined> {
    return this.ormRepository.findOne({ where: { name } });
  }

  async findById(id: string): Promise<Category | undefined> {
    return this.ormRepository.findOne({ where: { id } });
  }

  async save(category: Category): Promise<Category> {
    return this.ormRepository.save(category);
  }
}
