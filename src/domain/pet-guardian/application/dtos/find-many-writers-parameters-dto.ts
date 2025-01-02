import { ISearchParamsAndPageParamsDTO } from './search-param-and-page-params-dto';

export interface IFindManyWritersParametersDTO {
  // authenticateTutorId: string;
  searchAndPageParams: ISearchParamsAndPageParamsDTO;
  enabled?: string | null;
}
