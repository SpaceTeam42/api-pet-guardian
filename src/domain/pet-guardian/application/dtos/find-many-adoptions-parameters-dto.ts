import { ISearchParamsAndPageParamsDTO } from './search-param-and-page-params-dto';

export interface IFindManyAdoptionsParametersDTO {
  searchAndPageParams: ISearchParamsAndPageParamsDTO;
  enabled?: string | null;
}
