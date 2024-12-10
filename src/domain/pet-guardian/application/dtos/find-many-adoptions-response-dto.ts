import { Adoption } from '@infra/database/typeorm/entities/Adoption';

export interface IFindManyAdoptionsResponseDTO {
  totalAdoptions: number;
  adoptions: Adoption[];
}
