import { ISearchParamsAndPageParamsDTO } from './search-param-and-page-params-dto';

export interface IFindManyCategoriesParametersDTO {
  searchAndPageParams: ISearchParamsAndPageParamsDTO;
  enabled?: string | null;
}
