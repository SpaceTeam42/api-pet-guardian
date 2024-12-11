import { ISearchParamsAndPageParamsDTO } from './search-param-and-page-params-dto';

export interface IFindManyPetsParametersDTO {
  adopted?: string | null;
  searchAndPageParams: ISearchParamsAndPageParamsDTO;
  enabled?: string | null;
}
