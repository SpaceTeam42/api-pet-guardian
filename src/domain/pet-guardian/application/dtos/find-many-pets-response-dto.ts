import { Pet } from '@infra/database/typeorm/entities/Pet';

export interface IFindManyPetsResponseDTO {
  totalPets: number;
  pets: Pet[];
}
