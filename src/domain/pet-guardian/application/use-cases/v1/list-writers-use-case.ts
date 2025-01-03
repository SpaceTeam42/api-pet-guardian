import { inject, injectable } from 'tsyringe';

import { Writer } from '@infra/database/typeorm/entities/Writer';
import { IWritersRepository } from '../../repositories/v1/writers-repository';

interface IRequest {
  searchParam?: string | null;
  page?: string | null;
  perPage?: string | null;
  enabled?: string | null;
}

interface IResponse {
  writers: Writer[];
  totalWriters: number;
}

enum ENABLED_PAGE_PER_PAGE_PARAM_DEFAULT {
  ENABLED = 'true',
  PER_PAGE = '10',
}

@injectable()
export class ListWritersUseCase {
  constructor(
    @inject('WritersRepository')
    private writersRepository: IWritersRepository,
  ) {}

  async execute({
    searchParam,
    page,
    perPage = ENABLED_PAGE_PER_PAGE_PARAM_DEFAULT.PER_PAGE,
    enabled = ENABLED_PAGE_PER_PAGE_PARAM_DEFAULT.ENABLED,
  }: IRequest): Promise<IResponse> {
    const { writers, totalWriters } = await this.writersRepository.findMany({
      searchAndPageParams: { searchParam, page, perPage },
      enabled,
    });

    return { writers, totalWriters };
  }
}
