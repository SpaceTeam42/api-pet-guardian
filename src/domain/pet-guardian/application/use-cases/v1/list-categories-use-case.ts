import { inject, injectable } from 'tsyringe';

import { Category } from '@infra/database/typeorm/entities/Category';

import { ICategoriesRepository } from '../../repositories/v1/categories-repository';

interface IRequest {
  searchParam?: string | null;
  page?: string | null;
  perPage?: string | null;
  enabled?: string | null;
}

interface IResponse {
  categories: Category[];
  totalCategories: number;
}

enum ENABLED_PAGE_PER_PAGE_PARAM_DEFAULT {
  ENABLED = 'true',
  PER_PAGE = '10',
}

@injectable()
export class ListCategoriesUseCase {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,
  ) {}

  async execute({
    searchParam,
    page,
    perPage = ENABLED_PAGE_PER_PAGE_PARAM_DEFAULT.PER_PAGE,
    enabled = ENABLED_PAGE_PER_PAGE_PARAM_DEFAULT.ENABLED,
  }: IRequest): Promise<IResponse> {
    const { categories, totalCategories } =
      await this.categoriesRepository.findAll({
        searchAndPageParams: { searchParam, page, perPage },
        enabled,
      });

    return { categories, totalCategories };
  }
}
