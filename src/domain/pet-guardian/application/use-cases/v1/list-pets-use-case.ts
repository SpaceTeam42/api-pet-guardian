import { inject, injectable } from 'tsyringe';

import { Pet } from '@infra/database/typeorm/entities/Pet';

import { IPetsRepository } from '../../repositories/v1/pets-repository';

interface IRequest {
  adopted?: string | null;
  // searchParam?: string | null;
  page?: string | null;
  perPage?: string | null;
  // enabled?: string | null;
}

interface IResponse {
  pets: Pet[];
  totalPets: number;
}

enum ADOPTED_ENABLED_PAGE_PER_PAGE_PARAM_DEFAULT {
  ADOPTED = 'false',
  // ENABLED = 'true',
  PER_PAGE = '10',
}

@injectable()
export class ListPetsUseCase {
  constructor(
    @inject('PetsRepository')
    private petsRepository: IPetsRepository,
  ) {}

  async execute({
    adopted = ADOPTED_ENABLED_PAGE_PER_PAGE_PARAM_DEFAULT.ADOPTED,
    page,
    perPage = ADOPTED_ENABLED_PAGE_PER_PAGE_PARAM_DEFAULT.PER_PAGE,
    // enabled = ENABLED_PAGE_PER_PAGE_PARAM_DEFAULT.ENABLED,
  }: IRequest): Promise<IResponse> {
    const { pets, totalPets } = await this.petsRepository.findAll({
      adopted,
      searchAndPageParams: { page, perPage },
    });

    return { pets, totalPets };
  }
}
