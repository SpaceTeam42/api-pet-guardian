import { inject, injectable } from 'tsyringe';

import { IUsersRepository } from '../../repositories/v1/users-repository';

import { User } from '@infra/database/typeorm/entities/User';

interface IRequest {
  authenticateUserId: string;
  enabled?: string | null;
  searchParam?: string | null;
  page?: string | null;
  perPage?: string | null;
}

interface IResponse {
  users: User[];
  totalUsers: number;
}

enum ENABLED_PAGE_PER_PAGE_PARAM_DEFAULT {
  ENABLED = 'true',
  PER_PAGE = '10',
}

@injectable()
export class ListUsersUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({
    authenticateUserId,
    enabled = ENABLED_PAGE_PER_PAGE_PARAM_DEFAULT.ENABLED,
    searchParam,
    page,
    perPage = ENABLED_PAGE_PER_PAGE_PARAM_DEFAULT.PER_PAGE,
  }: IRequest): Promise<IResponse> {
    const { users, totalUsers } = await this.usersRepository.findAll({
      authenticateUserId,
      searchAndPageParams: {
        searchParam,
        page,
        perPage,
      },
      enabled,
    });

    return { users, totalUsers };
  }
}
