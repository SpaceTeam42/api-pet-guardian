import { ILike, Not, Repository } from 'typeorm';

import { postgresDataSource } from '@infra/database/typeorm/connections/postgres-connection';

import { Tutor } from '@infra/database/typeorm/entities/Tutor';

import { ITutorsRepository } from '@domain/pet-guardian/application/repositories/v1/tutors-repository';
import { ICreateTutorDTO } from '@domain/pet-guardian/application/dtos/create-tutor-dto';
import { IFindManyTutorsParametersDTO } from '@domain/pet-guardian/application/dtos/find-many-tutors-parameters-dto';
import { IFindManyTutorsResponseDTO } from '@domain/pet-guardian/application/dtos/find-many-tutors-response-dto';

export class TutorsRepository implements ITutorsRepository {
  private ormRepository: Repository<Tutor>;

  constructor() {
    this.ormRepository = postgresDataSource.getRepository(Tutor);
  }

  public async create({
    name,
    email,
    password,
    type,
    cnpj_cpf,
    manager_ong,
    avatar,
    personal_phone,
    personal_phone_is_whatsapp,
    public_phone,
    public_phone_is_whatsapp,
    enabled,
    street_name,
    street_number,
    complement,
    neighborhood,
    postal_code,
    reference,
    state,
    city,
  }: ICreateTutorDTO): Promise<Tutor> {
    const tutor = this.ormRepository.create({
      name,
      email,
      password,
      type,
      cnpj_cpf,
      manager_ong,
      avatar,
      personal_phone,
      personal_phone_is_whatsapp,
      public_phone,
      public_phone_is_whatsapp,
      enabled,
      street_name,
      street_number,
      complement,
      neighborhood,
      postal_code,
      reference,
      state,
      city,
    });

    await this.ormRepository.save(tutor);

    return tutor;
  }

  async findByEmail(email: string): Promise<Tutor | null> {
    return this.ormRepository.findOne({ where: { email } });
  }

  async findByCnpjCpf(cnpj_cpf: string): Promise<Tutor | null> {
    return this.ormRepository.findOne({ where: { cnpj_cpf } });
  }

  async findById(id: string): Promise<Tutor | null> {
    return this.ormRepository.findOne({ where: { id } });
  }

  async findAll({
    authenticateTutorId,
    searchAndPageParams: { searchParam, page, perPage },
    enabled,
  }: IFindManyTutorsParametersDTO): Promise<IFindManyTutorsResponseDTO> {
    let totalTutors = 0;
    let tutors: Tutor[];

    // ILIKE - case-insensitive
    // LIKE - case-sensitive

    if (searchParam) {
      const countUsers = await this.ormRepository.count({
        where: [
          {
            id: Not(authenticateTutorId),
            name: ILike(`%${searchParam}%`),
            enabled: enabled === 'true',
          },
          {
            id: Not(authenticateTutorId),
            cnpj_cpf: ILike(`%${searchParam}%`),
            enabled: enabled === 'true',
          },
        ],
      });

      totalTutors = countUsers;

      if (page) {
        const tutorsFind = await this.ormRepository.find({
          where: [
            {
              id: Not(authenticateTutorId),
              name: ILike(`%${searchParam}%`),
              enabled: enabled === 'true',
            },
            {
              id: Not(authenticateTutorId),
              cnpj_cpf: ILike(`%${searchParam}%`),
              enabled: enabled === 'true',
            },
          ],
          // quantos itens queremos pular
          skip: (Number(page) - 1) * Number(perPage),
          // quantos itens queremos
          take: Number(perPage),
          order: {
            name: 'ASC',
          },
        });

        tutors = tutorsFind;
      } else {
        const tutorsFind = await this.ormRepository.find({
          where: [
            {
              id: Not(authenticateTutorId),
              name: ILike(`%${searchParam}%`),
              enabled: enabled === 'true',
            },
            {
              id: Not(authenticateTutorId),
              cnpj_cpf: ILike(`%${searchParam}%`),
              enabled: enabled === 'true',
            },
          ],
          order: {
            name: 'ASC',
          },
        });

        tutors = tutorsFind;
      }
    } else {
      const countUsers = await this.ormRepository.count({
        where: {
          id: Not(authenticateTutorId),
          enabled: enabled === 'true',
        },
      });

      totalTutors = countUsers;

      if (page) {
        const tutorsFind = await this.ormRepository.find({
          where: {
            id: Not(authenticateTutorId),
            enabled: enabled === 'true',
          },
          // quantos itens queremos pular
          skip: (Number(page) - 1) * Number(perPage),
          // quantos itens queremos
          take: Number(perPage),
          order: {
            name: 'ASC',
          },
        });

        tutors = tutorsFind;
      } else {
        const tutorsFind = await this.ormRepository.find({
          where: {
            id: Not(authenticateTutorId),
            enabled: enabled === 'true',
          },

          order: {
            name: 'ASC',
          },
        });

        tutors = tutorsFind;
      }
    }

    return { totalTutors, tutors };
  }

  async save(tutor: Tutor): Promise<Tutor> {
    return this.ormRepository.save(tutor);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}
