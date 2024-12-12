import { Pet } from '@infra/database/typeorm/entities/Pet';

import { ICreatePetDTO } from '../../dtos/create-pet-dto';
import { IFindByIdPetDTO } from '../../dtos/find-by-id-pet-dto';
import { IFindManyPetsParametersDTO } from '../../dtos/find-many-pets-parameters-dto';
import { IFindManyPetsResponseDTO } from '../../dtos/find-many-pets-response-dto';
import { IFindManyPetsTutorParametersDTO } from '../../dtos/find-many-pets-tutor-parameters-dto';

export interface IPetsRepository {
  create({
    name,
    birthday,
    breed,
    category_id,
    gender,
    size,
    weight,
    city,
    state,
    tutor_id,
    description,
  }: ICreatePetDTO): Promise<Pet>;
  findById({ id, with_relation }: IFindByIdPetDTO): Promise<Pet | null>;
  findAll({
    adopted,
    searchAndPageParams: { searchParam, page, perPage },
  }: IFindManyPetsParametersDTO): Promise<IFindManyPetsResponseDTO>;
  findAllByTutorId({
    tutorId,
    adopted,
    searchAndPageParams: { page, perPage },
  }: IFindManyPetsTutorParametersDTO): Promise<IFindManyPetsResponseDTO>;
  findByTutorId(tutor_id: string): Promise<Pet | null>;
  save(pet: Pet): Promise<Pet>;
  delete(id: string): Promise<void>;
}
