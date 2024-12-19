import { ICreateLookingForPetDTO } from '../../dtos/create-looking-for-pet-dto';
import { IFindByIdLookingForPetDTO } from '../../dtos/find-by-id-looking-for-pet-dto';

import { LookingForPet } from '@infra/database/typeorm/entities/LookingForPet';
import { IFindManyLookingForPetsParametersDTO } from '../../dtos/find-many-looking-fot-pets-parameters-dto';
import { IFindManyLookingForPetsResponseDTO } from '../../dtos/find-many-looking-for-pets-response-dto';
import { IFindManyLookingForPetsTutorParametersDTO } from '../../dtos/find-many-looking-for-pets-tutor-parameters-dto';
import { IFindManyLookingForPetsUserParametersDTO } from '../../dtos/find-many-looking-for-pets-user-parameters-dto';

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
  findByTutorId({
    tutorId,
    searchAndPageParams: { page, perPage },
  }: IFindManyLookingForPetsTutorParametersDTO): Promise<IFindManyLookingForPetsResponseDTO>;
  findByUserId({
    userId,
    searchAndPageParams: { page, perPage },
  }: IFindManyLookingForPetsUserParametersDTO): Promise<IFindManyLookingForPetsResponseDTO>;
  save(looking_for_pets: LookingForPet): Promise<LookingForPet>;
  delete(id: string): Promise<void>;
}
