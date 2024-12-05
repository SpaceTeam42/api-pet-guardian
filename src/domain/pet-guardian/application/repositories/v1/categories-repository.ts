import { Category } from '@infra/database/typeorm/entities/Category';

import { ICreateCategoryDTO } from '../../dtos/create-category-dto';

import { IFindManyCategoriesParametersDTO } from '../../dtos/find-many-categories-parameters-dto';
import { IFindManyCategoriesResponseDTO } from '../../dtos/find-many-categories-response-dto';

export interface ICategoriesRepository {
  create({ name, icon }: ICreateCategoryDTO): Promise<Category>;
  findAll({
    searchAndPageParams: { searchParam, page, perPage },
    enabled,
  }: IFindManyCategoriesParametersDTO): Promise<IFindManyCategoriesResponseDTO>;
  findByName(name: string): Promise<Category | undefined>;
  findById(id: string): Promise<Category | undefined>;
  save(category: Category): Promise<Category>;
}
