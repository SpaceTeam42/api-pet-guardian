import { Repository } from 'typeorm';

import { postgresDataSource } from '@infra/database/typeorm/connections/postgres-connection';

import { Adoption } from '@infra/database/typeorm/entities/Adoption';

import { ICreateAdoptionDTO } from '@domain/pet-guardian/application/dtos/create-adoption-dto';

import { IAdoptionsRepository } from '@domain/pet-guardian/application/repositories/v1/adotions-repository';
import { IFindManyAdoptionsParametersDTO } from '@domain/pet-guardian/application/dtos/find-many-adoptions-parameters-dto';
import { IFindManyAdoptionsResponseDTO } from '@domain/pet-guardian/application/dtos/find-many-adoptions-response-dto';

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
    enabled,
  }: IFindManyAdoptionsParametersDTO): Promise<IFindManyAdoptionsResponseDTO> {
    return this.ormRepository.find({
      relations: ['tutor', 'pet'],
      order: { created_at: 'DESC' },
    });
  }

  async findByTutorId(tutor_id: string): Promise<Adoption | undefined> {
    return this.ormRepository.findOne({ where: { tutor_id } });
  }

  async findByPetId(pet_id: string): Promise<Adoption | undefined> {
    return this.ormRepository.findOne({ where: { pet_id } });
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
