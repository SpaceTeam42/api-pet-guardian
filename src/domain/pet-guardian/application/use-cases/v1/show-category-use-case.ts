import { inject, injectable } from 'tsyringe';

import { AppError } from '@core/errors/AppError';

import { Category } from '@infra/database/typeorm/entities/Category';

import { ICategoriesRepository } from '../../repositories/v1/categories-repository';

interface IRequest {
  id: string;
}

interface IResponse {
  category: Category;
}

@injectable()
export class ShowCategoryUseCase {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,
  ) {}

  async execute({ id }: IRequest): Promise<IResponse> {
    const category = await this.categoriesRepository.findById(id);

    if (!category) {
      throw new AppError('Category not found!', 404);
    }

    return { category };
  }
}
