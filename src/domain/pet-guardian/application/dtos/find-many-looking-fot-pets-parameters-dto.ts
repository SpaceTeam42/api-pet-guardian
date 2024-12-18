import { ISearchParamsAndPageParamsDTO } from './search-param-and-page-params-dto';

export interface IFindManyLookingForPetsParametersDTO {
  isFound?: string | null;
  searchAndPageParams: ISearchParamsAndPageParamsDTO;
  enabled?: string | null;
}
