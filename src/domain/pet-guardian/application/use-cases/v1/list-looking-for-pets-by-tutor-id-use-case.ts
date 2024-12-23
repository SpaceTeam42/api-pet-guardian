import { inject, injectable } from 'tsyringe';

import { ILookingForPetResponseDTO } from '../../dtos/looking-for-pet-response-dto';

import { ILookingForPetsRepository } from '../../repositories/v1/looking-for-pets-repository';
import { ITutorsRepository } from '../../repositories/v1/tutors-repository';

import { LookingForPetMap } from '@infra/http/mapper/looking-for-pet-mapper';
import { Tutor } from '@infra/database/typeorm/entities/Tutor';

interface IRequest {
  // searchParam?: string | null;
  page?: string | null;
  perPage?: string | null;
  tutorId?: string | null;
  // enabled?: string | null;
}

interface IResponse {
  pets: ILookingForPetResponseDTO[];
  totalPets: number;
}

enum PAGE_PER_PAGE_PARAM_DEFAULT {
  PER_PAGE = '10',
}

@injectable()
export class ListLookingForPetsByTutorIdUseCase {
  constructor(
    @inject('LookingForPetsRepository')
    private lookingForPetsRepository: ILookingForPetsRepository,

    @inject('TutorsRepository')
    private tutorsRepository: ITutorsRepository,
  ) {}

  async execute({
    page,
    perPage = PAGE_PER_PAGE_PARAM_DEFAULT.PER_PAGE,
    tutorId,
  }: IRequest): Promise<IResponse> {
    const { pets, totalPets } =
      await this.lookingForPetsRepository.findByTutorId({
        tutorId,
        searchAndPageParams: { page, perPage },
      });

    const lookingForPetResponse: ILookingForPetResponseDTO[] = [];

    for await (const lookingForPet of pets) {
      let tutor: Tutor;
      if (lookingForPet.tutor_id) {
        tutor = await this.tutorsRepository.findById(lookingForPet.tutor_id);
      }

      const lookingForPetDTO = LookingForPetMap.toDTO({
        pets: lookingForPet,
        tutor,
      });

      lookingForPetResponse.push(lookingForPetDTO);
    }

    return { pets: lookingForPetResponse, totalPets };
  }
}
