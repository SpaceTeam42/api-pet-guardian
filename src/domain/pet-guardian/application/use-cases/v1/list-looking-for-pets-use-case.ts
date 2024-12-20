import { inject, injectable } from 'tsyringe';

import { ILookingForPetsRepository } from '../../repositories/v1/looking-for-pets-repository';

import { LookingForPet } from '@infra/database/typeorm/entities/LookingForPet';

interface IRequest {
  searchParam?: string | null;
  page?: string | null;
  perPage?: string | null;
  isFound?: string | null;
  // enabled?: string | null;
}

interface IResponse {
  pets: LookingForPet[];
  totalPets: number;
}

@injectable()
export class ListLookingForPetsUseCase {
  constructor(
    @inject('LookingForPetsRepository')
    private lookingForPetsRepository: ILookingForPetsRepository,
  ) {}

  async execute({
    searchParam,
    page,
    perPage,
    isFound,
  }: IRequest): Promise<IResponse> {
    const { pets, totalPets } = await this.lookingForPetsRepository.findAll({
      isFound,
      searchAndPageParams: { searchParam, page, perPage },
    });

    return { pets, totalPets };
  }
}
