import { ILike, Repository } from 'typeorm';

import { postgresDataSource } from '@infra/database/typeorm/connections/postgres-connection';

import { ICreateLookingForPetDTO } from '@domain/pet-guardian/application/dtos/create-looking-for-pet-dto';
import { IFindByIdLookingForPetDTO } from '@domain/pet-guardian/application/dtos/find-by-id-looking-for-pet-dto';
import { IFindManyLookingForPetsResponseDTO } from '@domain/pet-guardian/application/dtos/find-many-looking-for-pets-response-dto';
import { IFindManyLookingForPetsParametersDTO } from '@domain/pet-guardian/application/dtos/find-many-looking-fot-pets-parameters-dto';
import { IFindManyLookingForPetsTutorParametersDTO } from '@domain/pet-guardian/application/dtos/find-many-looking-for-pets-tutor-parameters-dto';
import { IFindManyLookingForPetsUserParametersDTO } from '@domain/pet-guardian/application/dtos/find-many-looking-for-pets-user-parameters-dto';

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
    let totalPets = 0;
    let pets: LookingForPet[];

    // ILIKE - case-insensitive
    // LIKE - case-sensitive

    if (searchParam) {
      const countPets = await this.ormRepository.count({
        where: {
          name_pet: ILike(`%${searchParam}%`),
          is_found: isFound === 'true',
        },
      });

      totalPets = countPets;

      if (page) {
        const petsFind = await this.ormRepository.find({
          where: {
            name_pet: ILike(`%${searchParam}%`),
            is_found: isFound === 'true',
          },
          // quantos itens queremos pular
          skip: (Number(page) - 1) * Number(perPage),
          // quantos itens queremos
          take: Number(perPage),
          relations: ['category', 'looking_for_pet_images'],
          order: {
            name_pet: 'ASC',
          },
        });

        pets = petsFind;
      } else {
        const petsFind = await this.ormRepository.find({
          where: {
            name_pet: ILike(`%${searchParam}%`),
            is_found: isFound === 'true',
          },
          relations: ['category', 'looking_for_pet_images'],
          order: {
            name_pet: 'ASC',
          },
        });

        pets = petsFind;
      }
    } else {
      const countPets = await this.ormRepository.count({
        where: {
          is_found: isFound === 'true',
        },
      });

      totalPets = countPets;

      if (page) {
        const petsFind = await this.ormRepository.find({
          where: {
            is_found: isFound === 'true',
          },
          // quantos itens queremos pular
          skip: (Number(page) - 1) * Number(perPage),
          // quantos itens queremos
          take: Number(perPage),
          relations: ['category', 'looking_for_pet_images'],
          order: {
            name_pet: 'ASC',
          },
        });

        pets = petsFind;
      } else {
        const petsFind = await this.ormRepository.find({
          where: {
            is_found: isFound === 'true',
          },
          relations: ['category', 'looking_for_pet_images'],
          order: {
            name_pet: 'ASC',
          },
        });

        pets = petsFind;
      }
    }

    return { pets, totalPets };
  }

  async findById({
    id,
    with_relation,
  }: IFindByIdLookingForPetDTO): Promise<LookingForPet | null> {
    console.log(
      '🚀 ~ LookingForPetsRepository ~ with_relation:',
      with_relation,
    );
    if (with_relation) {
      return this.ormRepository.findOne({
        where: { id },
        relations: ['category', 'looking_for_pet_images'],
      });
    }

    return this.ormRepository.findOne({ where: { id } });
  }

  async findByTutorId({
    tutorId,
    searchAndPageParams: { page, perPage },
  }: IFindManyLookingForPetsTutorParametersDTO): Promise<IFindManyLookingForPetsResponseDTO> {
    let totalPets = 0;
    let pets: LookingForPet[];

    const countPets = await this.ormRepository.count({
      where: {
        tutor_id: tutorId,
      },
    });

    totalPets = countPets;

    if (page) {
      const petsFind = await this.ormRepository.find({
        where: {
          tutor_id: tutorId,
        },
        // quantos itens queremos pular
        skip: (Number(page) - 1) * Number(perPage),
        // quantos itens queremos
        take: Number(perPage),
        relations: ['category', 'looking_for_pet_images'],
        order: {
          name_pet: 'ASC',
        },
      });

      pets = petsFind;
    } else {
      const petsFind = await this.ormRepository.find({
        where: {
          tutor_id: tutorId,
        },
        relations: ['category', 'looking_for_pet_images'],
        order: {
          name_pet: 'ASC',
        },
      });

      pets = petsFind;
    }

    return { pets, totalPets };
  }

  async findByUserId({
    userId,
    searchAndPageParams: { page, perPage },
  }: IFindManyLookingForPetsUserParametersDTO): Promise<IFindManyLookingForPetsResponseDTO> {
    let totalPets = 0;
    let pets: LookingForPet[];

    const countPets = await this.ormRepository.count({
      where: {
        user_id: userId,
      },
    });

    totalPets = countPets;

    if (page) {
      const petsFind = await this.ormRepository.find({
        where: {
          user_id: userId,
        },
        // quantos itens queremos pular
        skip: (Number(page) - 1) * Number(perPage),
        // quantos itens queremos
        take: Number(perPage),
        relations: ['category', 'looking_for_pet_images'],
        order: {
          name_pet: 'ASC',
        },
      });

      pets = petsFind;
    } else {
      const petsFind = await this.ormRepository.find({
        where: {
          user_id: userId,
        },
        relations: ['category', 'looking_for_pet_images'],
        order: {
          name_pet: 'ASC',
        },
      });

      pets = petsFind;
    }

    return { pets, totalPets };
  }

  async save(looking_for_pets: LookingForPet): Promise<LookingForPet> {
    return this.ormRepository.save(looking_for_pets);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}
