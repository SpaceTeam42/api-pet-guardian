import { inject, injectable } from 'tsyringe';

import { AppError } from '@core/errors/AppError';

import { IHashComparer } from '../../cryptography/hash-comparer';
import { IHashGenerator } from '../../cryptography/hash-generator';

import { IUsersRepository } from '../../repositories/v1/users-repository';

interface IRequest {
  id: string;
  oldPassword: string;
  password: string;
}

@injectable()
export class UpdateUserPassword {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashGeneratorProvider')
    private hashGenerator: IHashGenerator,

    @inject('HashComparerProvider')
    private hashComparer: IHashComparer,
  ) {}

  async execute({ id, oldPassword, password }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(id);

    if (!user || user.enabled === false) {
      throw new AppError('User not found!', 404);
    }

    if (password && !oldPassword) {
      throw new AppError(
        'You need to inform the old password to set a new password',
        400,
      );
    }

    const checkOldPassword = await this.hashComparer.compare(
      oldPassword,
      user.password,
    );

    if (!checkOldPassword) {
      throw new AppError('Old password does not match', 400);
    }

    user.password = await this.hashGenerator.hash(password);

    await this.usersRepository.save(user);
  }
}
