import { ICreateLookingForPetDTO } from '../../dtos/create-looking-for-pet-dto';
import { IFindByIdLookingForPetDTO } from '../../dtos/find-by-id-looking-for-pet-dto';

import { LookingForPet } from '@infra/database/typeorm/entities/LookingForPet';
import { IFindManyLookingForPetsParametersDTO } from '../../dtos/find-many-looking-fot-pets-parameters-dto';
import { IFindManyLookingForPetsResponseDTO } from '../../dtos/find-many-looking-for-pets-response-dto';

export interface ILookingForPetsRepository {
  create({
    name_pet,
    breed,
    gender,
    category_id,
    name_tutor,
    phone_tutor,
    phone_tutor_is_whatsapp,
    last_seen,
    description,
    is_found,
    is_reward,
    reward_amount,
    state,
    city,
    tutor_id,
    user_id,
  }: ICreateLookingForPetDTO): Promise<LookingForPet>;
  findAll({
    isFound,
    searchAndPageParams: { searchParam, page, perPage },
  }: IFindManyLookingForPetsParametersDTO): Promise<IFindManyLookingForPetsResponseDTO>;
  findById({
    id,
    with_relation,
  }: IFindByIdLookingForPetDTO): Promise<LookingForPet | null>;
  findByTutorId(tutor_id: string): Promise<LookingForPet | undefined>;
  findAllByTutorId(tutor_id: string): Promise<LookingForPet[]>;
  findByUserId(user_id: string): Promise<LookingForPet | undefined>;
  save(looking_for_pets: LookingForPet): Promise<LookingForPet>;
  delete(id: string): Promise<void>;
}
