import { ILike, Repository } from 'typeorm';

import { postgresDataSource } from '@infra/database/typeorm/connections/postgres-connection';

import { Adoption } from '@infra/database/typeorm/entities/Adoption';

import { ICreateAdoptionDTO } from '@domain/pet-guardian/application/dtos/create-adoption-dto';

import { IAdoptionsRepository } from '@domain/pet-guardian/application/repositories/v1/adotions-repository';
import { IFindManyAdoptionsParametersDTO } from '@domain/pet-guardian/application/dtos/find-many-adoptions-parameters-dto';
import { IFindManyAdoptionsResponseDTO } from '@domain/pet-guardian/application/dtos/find-many-adoptions-response-dto';
import { IFindManyAdoptionsTutorParametersDTO } from '@domain/pet-guardian/application/dtos/find-many-adoptions-tutor-parameters-dto';

export class AdoptionsRepository implements IAdoptionsRepository {
  private ormRepository: Repository<Adoption>;

  constructor() {
    this.ormRepository = postgresDataSource.getRepository(Adoption);
  }

  async create({
    old_tutor_id,
    tutor_id,
    pet_id,
  }: ICreateAdoptionDTO): Promise<Adoption> {
    const adoption = this.ormRepository.create({
      old_tutor_id,
      tutor_id,
      pet_id,
    });

    await this.ormRepository.save(adoption);

    return adoption;
  }

  async findById(id: string): Promise<Adoption | undefined> {
    return this.ormRepository.findOne({
      where: { id },
      relations: ['pet', 'tutor'],
    });
  }

  async findAll({
    searchAndPageParams: { searchParam, page, perPage },
  }: IFindManyAdoptionsParametersDTO): Promise<IFindManyAdoptionsResponseDTO> {
    let totalAdoptions = 0;
    let adoptions: Adoption[];

    if (searchParam) {
      const countAdoptions = await this.ormRepository.count({
        where: {
          tutor: { name: ILike(`%${searchParam}%`) },
        },
      });

      totalAdoptions = countAdoptions;

      if (page) {
        const adoptionsFind = await this.ormRepository.find({
          where: {
            tutor: { name: ILike(`%${searchParam}%`) },
          },
          // quantos itens queremos pular
          skip: (Number(page) - 1) * Number(perPage),
          // quantos itens queremos
          take: Number(perPage),
          relations: ['pet', 'tutor'],
          order: {
            pet: { name: 'ASC' },
          },
        });

        adoptions = adoptionsFind;
      } else {
        const adoptionsFind = await this.ormRepository.find({
          where: {
            tutor: { name: ILike(`%${searchParam}%`) },
          },
          relations: ['pet', 'tutor'],
          order: {
            pet: { name: 'ASC' },
          },
        });

        adoptions = adoptionsFind;
      }
    } else {
      const countAdoptions = await this.ormRepository.count();

      totalAdoptions = countAdoptions;

      if (page) {
        const adoptionsFind = await this.ormRepository.find({
          // quantos itens queremos pular
          skip: (Number(page) - 1) * Number(perPage),
          // quantos itens queremos
          take: Number(perPage),
          relations: ['pet', 'tutor'],
          order: {
            pet: { name: 'ASC' },
          },
        });

        adoptions = adoptionsFind;
      } else {
        const adoptionsFind = await this.ormRepository.find({
          relations: ['pet', 'tutor'],
          order: {
            pet: { name: 'ASC' },
          },
        });

        adoptions = adoptionsFind;
      }
    }

    return { adoptions, totalAdoptions };

    // return this.ormRepository.find({
    //   relations: ['tutor', 'pet'],
    //   order: { created_at: 'DESC' },
    // });
  }

  async findByTutorId({
    tutorId,
    searchAndPageParams: { page, perPage },
  }: IFindManyAdoptionsTutorParametersDTO): Promise<IFindManyAdoptionsResponseDTO> {
    let totalAdoptions = 0;
    let adoptions: Adoption[];

    const countAdoptions = await this.ormRepository.count({
      where: {
        tutor_id: tutorId,
      },
    });

    totalAdoptions = countAdoptions;

    if (page) {
      const adoptionsFind = await this.ormRepository.find({
        where: {
          tutor_id: tutorId,
        },
        // quantos itens queremos pular
        skip: (Number(page) - 1) * Number(perPage),
        // quantos itens queremos
        take: Number(perPage),
        relations: ['pet', 'tutor'],
        order: {
          pet: { name: 'ASC' },
        },
      });

      adoptions = adoptionsFind;
    } else {
      const adoptionsFind = await this.ormRepository.find({
        where: {
          tutor_id: tutorId,
        },
        relations: ['pet', 'tutor'],
        order: {
          pet: { name: 'ASC' },
        },
      });

      adoptions = adoptionsFind;
    }

    return { adoptions, totalAdoptions };

    // return this.ormRepository.findOne({ where: { tutor_id: tutorId } });
  }

  async findByPetId(pet_id: string): Promise<Adoption | undefined> {
    return this.ormRepository.findOne({
      where: { pet_id },
      relations: ['pet', 'tutor'],
    });
  }

  async findByShortCode(short_code: string): Promise<Adoption | undefined> {
    return this.ormRepository.findOne({
      where: { short_code },
      relations: ['pet', 'tutor'],
    });
  }

  async save(adoption: Adoption): Promise<Adoption> {
    return this.ormRepository.save(adoption);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}
