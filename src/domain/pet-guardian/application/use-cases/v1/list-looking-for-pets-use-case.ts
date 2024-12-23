import { inject, injectable } from 'tsyringe';

import { ILookingForPetResponseDTO } from '../../dtos/looking-for-pet-response-dto';

import { ILookingForPetsRepository } from '../../repositories/v1/looking-for-pets-repository';

import { ITutorsRepository } from '../../repositories/v1/tutors-repository';
import { IUsersRepository } from '../../repositories/v1/users-repository';

import { Tutor } from '@infra/database/typeorm/entities/Tutor';
import { User } from '@infra/database/typeorm/entities/User';

import { LookingForPetMap } from '@infra/http/mapper/looking-for-pet-mapper';

interface IRequest {
  searchParam?: string | null;
  page?: string | null;
  perPage?: string | null;
  isFound?: string | null;
  // enabled?: string | null;
}

interface IResponse {
  pets: ILookingForPetResponseDTO[];
  totalPets: number;
}

enum IS_FOUND_PAGE_PER_PAGE_PARAM_DEFAULT {
  IS_FOUND = 'false',
  PER_PAGE = '10',
}

@injectable()
export class ListLookingForPetsUseCase {
  constructor(
    @inject('LookingForPetsRepository')
    private lookingForPetsRepository: ILookingForPetsRepository,

    @inject('TutorsRepository')
    private tutorsRepository: ITutorsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({
    searchParam,
    page,
    perPage = IS_FOUND_PAGE_PER_PAGE_PARAM_DEFAULT.PER_PAGE,
    isFound = IS_FOUND_PAGE_PER_PAGE_PARAM_DEFAULT.IS_FOUND,
  }: IRequest): Promise<IResponse> {
    const { pets, totalPets } = await this.lookingForPetsRepository.findAll({
      isFound,
      searchAndPageParams: { searchParam, page, perPage },
    });

    const lookingForPetResponse: ILookingForPetResponseDTO[] = [];

    for await (const lookingForPet of pets) {
      let tutor: Tutor;
      if (lookingForPet.tutor_id) {
        tutor = await this.tutorsRepository.findById(lookingForPet.tutor_id);
      }

      let user: User;
      if (lookingForPet.user_id) {
        user = await this.usersRepository.findById(lookingForPet.user_id);
      }

      const lookingForPetDTO = LookingForPetMap.toDTO({
        pets: lookingForPet,
        tutor,
        user,
      });

      lookingForPetResponse.push(lookingForPetDTO);
    }

    return { pets: lookingForPetResponse, totalPets };
  }
}
