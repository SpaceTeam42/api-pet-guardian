import { ISearchParamsAndPageParamsDTO } from './search-param-and-page-params-dto';

export interface IFindManyUsersParametersDTO {
  authenticateUserId: string;
  searchAndPageParams: ISearchParamsAndPageParamsDTO;
  enabled?: string | null;
}
