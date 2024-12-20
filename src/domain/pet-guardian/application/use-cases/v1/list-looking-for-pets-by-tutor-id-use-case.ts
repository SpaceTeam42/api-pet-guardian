import { inject, injectable } from 'tsyringe';

import { ILookingForPetsRepository } from '../../repositories/v1/looking-for-pets-repository';

import { LookingForPet } from '@infra/database/typeorm/entities/LookingForPet';

interface IRequest {
  // searchParam?: string | null;
  page?: string | null;
  perPage?: string | null;
  tutorId?: string | null;
  // enabled?: string | null;
}

interface IResponse {
  pets: LookingForPet[];
  totalPets: number;
}

@injectable()
export class ListLookingForPetsByTutorId {
  constructor(
    @inject('LookingForPetsRepository')
    private lookingForPetsRepository: ILookingForPetsRepository,
  ) {}

  async execute({ page, perPage, tutorId }: IRequest): Promise<IResponse> {
    const { pets, totalPets } =
      await this.lookingForPetsRepository.findByTutorId({
        tutorId,
        searchAndPageParams: { page, perPage },
      });

    return { pets, totalPets };
  }
}
