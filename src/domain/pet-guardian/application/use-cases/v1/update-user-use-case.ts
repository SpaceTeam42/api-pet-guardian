import { inject, injectable } from 'tsyringe';

import { AppError } from '@core/errors/AppError';

import { User, UserTypeEnum } from '@infra/database/typeorm/entities/User';
import { IUsersRepository } from '../../repositories/v1/users-repository';

interface IRequest {
  id: string;
  name: string;
  email: string;
  type: keyof typeof UserTypeEnum;
  enabled: boolean;
}

interface IResponse {
  user: User;
}

@injectable()
export class UpdateUseUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({
    id,
    name,
    email,
    type,
    enabled,
  }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError('User not found!', 404);
    }

    const userUpdatedWithEmail = await this.usersRepository.findByEmail(email);

    if (userUpdatedWithEmail && userUpdatedWithEmail.id !== user.id) {
      throw new AppError('E-mail already in use!', 400);
    }

    if (User.getUserTypeEnum(type) === '') {
      throw new AppError('User type invalid!', 400);
    }

    user.name = name;
    user.email = email;
    user.type = type;
    user.enabled = enabled;

    const userUpdated = await this.usersRepository.save(user);

    return { user: userUpdated };
  }
}
