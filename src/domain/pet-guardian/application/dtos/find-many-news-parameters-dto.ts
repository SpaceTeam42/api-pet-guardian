import { ISearchParamsAndPageParamsDTO } from './search-param-and-page-params-dto';

export interface IFindManyNewsParametersDTO {
  // authenticateTutorId: string;
  searchAndPageParams: ISearchParamsAndPageParamsDTO;
  enabled?: string | null;
}
