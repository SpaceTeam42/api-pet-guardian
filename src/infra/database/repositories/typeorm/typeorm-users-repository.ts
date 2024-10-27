import { Repository } from 'typeorm';

import { postgresDataSource } from '@infra/database/typeorm/connections/postgres-connection';

import { IUsersRepository } from '@domain/pet-guardian/application/repositories/users-repository';
import { ICreateUserDTO } from '@domain/pet-guardian/application/dtos/create-user-dto';
import { User } from '@infra/database/typeorm/entities/User';

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

  public async findAll(): Promise<User[]> {
    return this.ormRepository.find();
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}

export { UsersRepository };
