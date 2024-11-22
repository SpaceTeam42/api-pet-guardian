import { inject, injectable } from 'tsyringe';

import { Tutor } from '@infra/database/typeorm/entities/Tutor';
import { ITutorsRepository } from '@domain/pet-guardian/application/repositories/v1/tutors-repository';

interface IRequest {
  searchParam?: string | null;
  page?: string | null;
  perPage?: string | null;
  enabled?: string | null;
}

interface IResponse {
  tutors: Tutor[];
  totalTutors: number;
}

enum ENABLED_PAGE_PER_PAGE_PARAM_DEFAULT {
  ENABLED = 'true',
  PER_PAGE = '10',
}

@injectable()
export class ListTutorsUseCase {
  constructor(
    @inject('TutorsRepository')
    private tutorsRepository: ITutorsRepository,
  ) {}

  async execute({
    searchParam,
    page,
    perPage = ENABLED_PAGE_PER_PAGE_PARAM_DEFAULT.PER_PAGE,
    enabled = ENABLED_PAGE_PER_PAGE_PARAM_DEFAULT.ENABLED,
  }: IRequest): Promise<IResponse> {
    const { tutors, totalTutors } = await this.tutorsRepository.findMany({
      searchAndPageParams: { searchParam, page, perPage },
      enabled,
    });

    return { tutors, totalTutors };
  }
}
