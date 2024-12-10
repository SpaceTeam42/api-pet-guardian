import { Adoption } from '@infra/database/typeorm/entities/Adoption';

import { ICreateAdoptionDTO } from '../../dtos/create-adoption-dto';
import { IFindManyAdoptionsParametersDTO } from '../../dtos/find-many-adoptions-parameters-dto';
import { IFindManyAdoptionsResponseDTO } from '../../dtos/find-many-adoptions-response-dto';

export interface IAdoptionsRepository {
  create({
    old_tutor_id,
    tutor_id,
    pet_id,
  }: ICreateAdoptionDTO): Promise<Adoption>;
  findById(id: string): Promise<Adoption | undefined>;
  findAll({
    searchAndPageParams: { searchParam, page, perPage },
    enabled,
  }: IFindManyAdoptionsParametersDTO): Promise<IFindManyAdoptionsResponseDTO[]>;
  findByTutorId(tutor_id: string): Promise<Adoption | undefined>;
  findByPetId(pet_id: string): Promise<Adoption | undefined>;
  findByShortCode(short_code: string): Promise<Adoption | undefined>;
  save(adoption: Adoption): Promise<Adoption>;
  delete(id: string): Promise<void>;
}
