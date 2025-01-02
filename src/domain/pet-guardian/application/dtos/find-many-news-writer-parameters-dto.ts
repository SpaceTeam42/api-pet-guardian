import { ISearchParamsAndPageParamsDTO } from './search-param-and-page-params-dto';

export interface IFindManyNewsWriterParametersDTO {
  writerId: string;
  searchAndPageParams: ISearchParamsAndPageParamsDTO;
  enabled?: string | null;
}
