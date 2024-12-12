import { ILike, Repository } from 'typeorm';

import { postgresDataSource } from '@infra/database/typeorm/connections/postgres-connection';

import { Pet } from '@infra/database/typeorm/entities/Pet';

import { ICreatePetDTO } from '@domain/pet-guardian/application/dtos/create-pet-dto';
import { IFindByIdPetDTO } from '@domain/pet-guardian/application/dtos/find-by-id-pet-dto';
import { IFindManyPetsParametersDTO } from '@domain/pet-guardian/application/dtos/find-many-pets-parameters-dto';
import { IFindManyPetsResponseDTO } from '@domain/pet-guardian/application/dtos/find-many-pets-response-dto';
import { IFindManyPetsTutorParametersDTO } from '@domain/pet-guardian/application/dtos/find-many-pets-tutor-parameters-dto';
import { IPetsRepository } from '@domain/pet-guardian/application/repositories/v1/pets-repository';

export class PetsRepository implements IPetsRepository {
  private ormRepository: Repository<Pet>;

  constructor() {
    this.ormRepository = postgresDataSource.getRepository(Pet);
  }

  async create({
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
  }: ICreatePetDTO): Promise<Pet> {
    const pet = this.ormRepository.create({
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
    });

    await this.ormRepository.save(pet);

    return pet;
  }

  /**
   * with_relation: This parameter is necessary, because to update the pet data
   * in the data update or adoption, you need to remove the relationship so that
   * the pet data can be updated.
   */
  async findById({ id, with_relation }: IFindByIdPetDTO): Promise<Pet | null> {
    if (with_relation) {
      return this.ormRepository.findOne({
        where: { id },
        relations: ['category', 'tutor', 'pet_images'],
      });
    }

    return this.ormRepository.findOne({
      where: { id },
    });
  }

  async findAll({
    adopted,
    searchAndPageParams: { searchParam, page, perPage },
  }: IFindManyPetsParametersDTO): Promise<IFindManyPetsResponseDTO> {
    let totalPets = 0;
    let pets: Pet[];

    // ILIKE - case-insensitive
    // LIKE - case-sensitive

    if (searchParam) {
      const countPets = await this.ormRepository.count({
        where: {
          name: ILike(`%${searchParam}%`),
          adopted: adopted === 'true',
        },
      });

      totalPets = countPets;

      if (page) {
        const petsFind = await this.ormRepository.find({
          where: {
            name: ILike(`%${searchParam}%`),
            adopted: adopted === 'true',
          },
          // quantos itens queremos pular
          skip: (Number(page) - 1) * Number(perPage),
          // quantos itens queremos
          take: Number(perPage),
          relations: ['category', 'tutor'],
          order: {
            name: 'ASC',
          },
        });

        pets = petsFind;
      } else {
        const petsFind = await this.ormRepository.find({
          where: {
            name: ILike(`%${searchParam}%`),
            adopted: adopted === 'true',
          },
          relations: ['category', 'tutor'],
          order: {
            name: 'ASC',
          },
        });

        pets = petsFind;
      }
    } else {
      const countPets = await this.ormRepository.count({
        where: {
          adopted: adopted === 'true',
        },
      });

      totalPets = countPets;

      if (page) {
        const petsFind = await this.ormRepository.find({
          where: {
            adopted: adopted === 'true',
          },
          // quantos itens queremos pular
          skip: (Number(page) - 1) * Number(perPage),
          // quantos itens queremos
          take: Number(perPage),
          relations: ['category', 'tutor'],
          order: {
            name: 'ASC',
          },
        });

        pets = petsFind;
      } else {
        const petsFind = await this.ormRepository.find({
          where: {
            adopted: adopted === 'true',
          },
          relations: ['category', 'tutor'],
          order: {
            name: 'ASC',
          },
        });

        pets = petsFind;
      }
    }

    return { pets, totalPets };
  }

  async findAllByTutorId({
    tutorId,
    adopted,
    searchAndPageParams: { page, perPage },
  }: IFindManyPetsTutorParametersDTO): Promise<IFindManyPetsResponseDTO> {
    let totalPets = 0;
    let pets: Pet[];

    // ILIKE - case-insensitive
    // LIKE - case-sensitive

    const countPets = await this.ormRepository.count({
      where: {
        tutor_id: tutorId,
        adopted: adopted === 'true',
      },
    });

    totalPets = countPets;

    if (page) {
      const petsFind = await this.ormRepository.find({
        where: {
          tutor_id: tutorId,
          adopted: adopted === 'true',
        },
        // quantos itens queremos pular
        skip: (Number(page) - 1) * Number(perPage),
        // quantos itens queremos
        take: Number(perPage),
        relations: ['category', 'tutor'],
        order: {
          name: 'ASC',
        },
      });

      pets = petsFind;
    } else {
      const petsFind = await this.ormRepository.find({
        where: {
          tutor_id: tutorId,
          adopted: adopted === 'true',
        },
        relations: ['category', 'tutor'],
        order: {
          name: 'ASC',
        },
      });

      pets = petsFind;
    }

    return { pets, totalPets };
  }

  async findByTutorId(tutor_id: string): Promise<Pet | null> {
    return this.ormRepository.findOne({
      where: { tutor_id },
      relations: ['category', 'tutor'],
    });
  }

  async save(pet: Pet): Promise<Pet> {
    return this.ormRepository.save(pet);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}
