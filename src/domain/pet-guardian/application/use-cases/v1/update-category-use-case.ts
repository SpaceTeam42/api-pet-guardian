import { inject, injectable } from 'tsyringe';

import { AppError } from '@core/errors/AppError';

import { Category } from '@infra/database/typeorm/entities/Category';

import { ICategoriesRepository } from '../../repositories/v1/categories-repository';

interface IRequest {
  id: string;
  name: string;
  enabled: boolean;
}

interface IResponse {
  category: Category;
}

@injectable()
export class UpdateCategoryUseCase {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,
  ) {}

  async execute({ id, name, enabled }: IRequest): Promise<IResponse> {
    const category = await this.categoriesRepository.findById(id);

    if (!category) {
      throw new AppError('Category not found!', 404);
    }

    const categoryUpdateWithName = await this.categoriesRepository.findByName(
      name.toUpperCase(),
    );

    if (categoryUpdateWithName && categoryUpdateWithName.id !== category.id) {
      throw new AppError('Name already in use!', 400);
    }

    category.name = name.toUpperCase();
    category.enabled = enabled;

    await this.categoriesRepository.save(category);

    return { category };
  }
}
