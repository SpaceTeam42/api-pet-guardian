import { ISearchParamsAndPageParamsDTO } from './search-param-and-page-params-dto';

export interface IFindManyLookingForPetsTutorParametersDTO {
  tutorId: string;
  searchAndPageParams: ISearchParamsAndPageParamsDTO;
  enabled?: string | null;
}
