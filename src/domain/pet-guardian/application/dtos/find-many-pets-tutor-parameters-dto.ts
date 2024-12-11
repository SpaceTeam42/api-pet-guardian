import { ISearchParamsAndPageParamsDTO } from './search-param-and-page-params-dto';

export interface IFindManyPetsTutorParametersDTO {
  tutorId: string;
  adopted?: string | null;
  searchAndPageParams: ISearchParamsAndPageParamsDTO;
  enabled?: string | null;
}
