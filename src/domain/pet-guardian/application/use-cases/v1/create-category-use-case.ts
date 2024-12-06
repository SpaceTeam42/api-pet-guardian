import { inject, injectable } from 'tsyringe';

import { AppError } from '@core/errors/AppError';

import { Category } from '@infra/database/typeorm/entities/Category';

import { ICategoriesRepository } from '../../repositories/v1/categories-repository';

interface IRequest {
  name: string;
}

interface IResponse {
  category: Category;
}

@injectable()
export class CreateCategoryUseCase {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,
  ) {}

  async execute({ name }: IRequest): Promise<IResponse> {
    const categoryExists = await this.categoriesRepository.findByName(
      name.toUpperCase(),
    );

    if (categoryExists) {
      throw new AppError('Category already exists!', 400);
    }

    const category = await this.categoriesRepository.create({ name });

    return { category };
  }
}
