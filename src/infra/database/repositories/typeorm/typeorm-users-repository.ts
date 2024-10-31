import { ILike, Not, Repository } from 'typeorm';

import { postgresDataSource } from '@infra/database/typeorm/connections/postgres-connection';

import { IUsersRepository } from '@domain/pet-guardian/application/repositories/v1/users-repository';
import { ICreateUserDTO } from '@domain/pet-guardian/application/dtos/create-user-dto';
import { User } from '@infra/database/typeorm/entities/User';
import { IFindManyUsersResponseDTO } from '@domain/pet-guardian/application/dtos/find-many-users-response-dto';
import { IFindManyUsersParametersDTO } from '@domain/pet-guardian/application/dtos/find-many-users-parameters-dto';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = postgresDataSource.getRepository(User);
  }

  public async create({
    name,
    email,
    password,
    type,
  }: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({ name, email, password, type });

    await this.ormRepository.save(user);

    return user;
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.ormRepository.findOne({ where: { email } });
  }

  public async findById(id: string): Promise<User | null> {
    return this.ormRepository.findOne({ where: { id } });
  }

  public async findAll({
    authenticateUserId,
    searchAndPageParams: { searchParam, page, perPage },
    enabled,
  }: IFindManyUsersParametersDTO): Promise<IFindManyUsersResponseDTO> {
    let totalUsers = 0;
    let users: User[];

    // ILIKE - case-insensitive
    // LIKE - case-sensitive

    if (searchParam) {
      const countUsers = await this.ormRepository.count({
        where: {
          id: Not(authenticateUserId),
          name: ILike(`%${searchParam}%`),
          enabled: enabled === 'true',
        },
      });

      totalUsers = countUsers;

      if (page) {
        const usersFind = await this.ormRepository.find({
          where: {
            id: Not(authenticateUserId),
            name: ILike(`%${searchParam}%`),
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

        users = usersFind;
      } else {
        const usersFind = await this.ormRepository.find({
          where: {
            id: Not(authenticateUserId),
            name: ILike(`%${searchParam}%`),
            enabled: enabled === 'true',
          },
          order: {
            name: 'ASC',
          },
        });

        users = usersFind;
      }
    } else {
      const countUsers = await this.ormRepository.count({
        where: {
          id: Not(authenticateUserId),
          enabled: enabled === 'true',
        },
      });

      totalUsers = countUsers;

      if (page) {
        const usersFind = await this.ormRepository.find({
          where: {
            id: Not(authenticateUserId),
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

        users = usersFind;
      } else {
        const usersFind = await this.ormRepository.find({
          where: {
            id: Not(authenticateUserId),
            enabled: enabled === 'true',
          },
          order: {
            name: 'ASC',
          },
        });

        users = usersFind;
      }
    }

    return { totalUsers, users };
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}

export { UsersRepository };
