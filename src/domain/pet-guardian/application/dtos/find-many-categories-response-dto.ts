import { Category } from '@infra/database/typeorm/entities/Category';

export interface IFindManyCategoriesResponseDTO {
  totalCategories: number;
  categories: Category[];
}
