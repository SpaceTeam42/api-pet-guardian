import { inject, injectable } from 'tsyringe';

import { AppError } from '@core/errors/AppError';

import { User } from '@infra/database/typeorm/entities/User';

import { IUsersRepository } from '../../repositories/v1/users-repository';

interface IRequest {
  id: string;
}

interface IResponse {
  user: User;
}

@injectable()
export class ShowUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ id }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findById(id);

    if (!user || user.enabled === false) {
      throw new AppError('User not found!', 404);
    }

    return { user };
  }
}
