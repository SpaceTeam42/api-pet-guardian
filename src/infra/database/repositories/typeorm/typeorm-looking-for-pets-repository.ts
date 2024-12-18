import { Repository } from 'typeorm';

import { postgresDataSource } from '@infra/database/typeorm/connections/postgres-connection';

import { ICreateLookingForPetDTO } from '@domain/pet-guardian/application/dtos/create-looking-for-pet-dto';
import { IFindByIdLookingForPetDTO } from '@domain/pet-guardian/application/dtos/find-by-id-looking-for-pet-dto';
import { IFindManyLookingForPetsResponseDTO } from '@domain/pet-guardian/application/dtos/find-many-looking-for-pets-response-dto';
import { IFindManyLookingForPetsParametersDTO } from '@domain/pet-guardian/application/dtos/find-many-looking-fot-pets-parameters-dto';
import { ILookingForPetsRepository } from '@domain/pet-guardian/application/repositories/v1/looking-for-pets-repository';

import { LookingForPet } from '@infra/database/typeorm/entities/LookingForPet';

export class LookingForPetsRepository implements ILookingForPetsRepository {
  private ormRepository: Repository<LookingForPet>;

  constructor() {
    this.ormRepository = postgresDataSource.getRepository(LookingForPet);
  }

  async create({
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
    enabled,
  }: ICreateLookingForPetDTO): Promise<LookingForPet> {
    const lookingForPet = this.ormRepository.create({
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
      enabled,
    });

    await this.ormRepository.save(lookingForPet);

    return lookingForPet;
  }

  async findAll({
    isFound,
    searchAndPageParams: { searchParam, page, perPage },
  }: IFindManyLookingForPetsParametersDTO): Promise<IFindManyLookingForPetsResponseDTO> {
    const totalPets = 0;
    let pets: LookingForPet[];

    // ILIKE - case-insensitive
    // LIKE - case-sensitive
  }

  async findById({
    id,
    with_relation,
  }: IFindByIdLookingForPetDTO): Promise<LookingForPet | null> {
    throw new Error('Method not implemented.');
  }

  async findByTutorId(tutor_id: string): Promise<LookingForPet | undefined> {
    throw new Error('Method not implemented.');
  }

  async findAllByTutorId(tutor_id: string): Promise<LookingForPet[]> {
    throw new Error('Method not implemented.');
  }

  async findByUserId(user_id: string): Promise<LookingForPet | undefined> {
    throw new Error('Method not implemented.');
  }

  async save(looking_for_pets: LookingForPet): Promise<LookingForPet> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
