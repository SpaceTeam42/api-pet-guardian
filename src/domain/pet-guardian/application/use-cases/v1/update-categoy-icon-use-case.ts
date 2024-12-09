import { inject, injectable } from 'tsyringe';

import uploadConfig from '@config/upload';

import { AppError } from '@core/errors/AppError';

import { Category } from '@infra/database/typeorm/entities/Category';

import { ICategoriesRepository } from '../../repositories/v1/categories-repository';
import { IStorage } from '../../storage/storage';

interface IRequest {
  id: string;
  iconFilename?: string;
}

interface IResponse {
  category: Category;
}

@injectable()
export class UpdateCategoryIconUseCase {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,

    @inject('StorageProvider')
    private storageProvider: IStorage,
  ) {}

  async execute({ id, iconFilename }: IRequest): Promise<IResponse> {
    const category = await this.categoriesRepository.findById(id);

    if (!category) {
      throw new AppError('Category not found!', 404);
    }

    let iconImage = null;
    if (iconFilename) {
      if (category.icon) {
        await this.storageProvider.delete(
          category.icon,
          uploadConfig.categoriesFolder,
        );
      }

      iconImage = await this.storageProvider.save(
        iconFilename,
        uploadConfig.categoriesFolder,
      );
    }

    category.icon = iconImage;

    await this.categoriesRepository.save(category);

    return { category };
  }
}
