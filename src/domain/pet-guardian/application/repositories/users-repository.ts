import { User } from '@infra/database/typeorm/entities/User';

import { ICreateUserDTO } from '@domain/pet-guardian/application/dtos/create-user-dto';
import { IFindManyUsersParametersDTO } from '../dtos/find-many-users-parameters-dto';
import { IFindManyUsersResponseDTO } from '../dtos/find-many-users-response-dto';

interface IUsersRepository {
  create({ name, email, password, type }: ICreateUserDTO): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findAll({
    authenticateUserId,
    searchAndPageParams: { searchParam, page, perPage },
    enabled,
  }: IFindManyUsersParametersDTO): Promise<IFindManyUsersResponseDTO>;
  save(user: User): Promise<User>;
}

export { IUsersRepository };
