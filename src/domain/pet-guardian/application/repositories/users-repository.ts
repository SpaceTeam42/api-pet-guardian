import { User } from '@infra/database/typeorm/entities/User';

import { ICreateUserDTO } from '@domain/pet-guardian/application/dtos/create-user-dto';

interface IUsersRepository {
  create({ name, email, password, type }: ICreateUserDTO): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  save(user: User): Promise<User>;
}

export { IUsersRepository };
