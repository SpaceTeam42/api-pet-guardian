import { injectable, inject } from 'tsyringe';

import { AppError } from '@core/errors/AppError';

import { IHashGenerator } from '@domain/pet-guardian/application/cryptography/hash-generator';

import { ICreateUserDTO } from '@domain/pet-guardian/application/dtos/create-user-dto';
import { IUsersRepository } from '@domain/pet-guardian/application/repositories/v1/users-repository';

import { User } from '@infra/database/typeorm/entities/User';

type IResponse = {
  user: User;
};

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashGeneratorProvider')
    private hashGenerator: IHashGenerator,
  ) {}

  public async execute({
    name,
    email,
    password,
    type,
  }: ICreateUserDTO): Promise<IResponse> {
    const userExists = await this.usersRepository.findByEmail(email);

    if (userExists) {
      throw new AppError('E-mail already in use!', 400);
    }

    if (User.getUserTypeEnum(type) === '') {
      throw new AppError('User type invalid!', 400);
    }

    const passwordHash = await this.hashGenerator.hash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      password: passwordHash,
      type,
    });

    return { user };
  }
}
