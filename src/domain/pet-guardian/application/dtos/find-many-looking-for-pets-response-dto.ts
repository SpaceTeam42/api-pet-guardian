import { LookingForPet } from '@infra/database/typeorm/entities/LookingForPet';

export interface IFindManyLookingForPetsResponseDTO {
  totalPets: number;
  pets: LookingForPet[];
}
