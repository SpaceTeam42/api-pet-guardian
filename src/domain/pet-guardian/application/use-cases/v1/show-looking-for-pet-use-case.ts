import { inject, injectable } from 'tsyringe';

import { AppError } from '@core/errors/AppError';

import { ILookingForPetResponseDTO } from '../../dtos/looking-for-pet-response-dto';

import { ILookingForPetsRepository } from '../../repositories/v1/looking-for-pets-repository';
import { ITutorsRepository } from '../../repositories/v1/tutors-repository';
import { IUsersRepository } from '../../repositories/v1/users-repository';

import { Tutor } from '@infra/database/typeorm/entities/Tutor';
import { User } from '@infra/database/typeorm/entities/User';

import { LookingForPet } from '@infra/database/typeorm/entities/LookingForPet';

import { LookingForPetMap } from '@infra/http/mapper/looking-for-pet-mapper';

interface IRequest {
  id: string;
  withRelation?: string;
}

interface IResponse {
  pet: ILookingForPetResponseDTO;
}

@injectable()
export class ShowLookingForPetUseCase {
  constructor(
    @inject('LookingForPetsRepository')
    private lookingForPetsRepository: ILookingForPetsRepository,

    @inject('TutorsRepository')
    private tutorsRepository: ITutorsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ id, withRelation = 'false' }: IRequest): Promise<IResponse> {
    let lookingForPet: LookingForPet;

    if (withRelation) {
      lookingForPet = await this.lookingForPetsRepository.findById({
        id,
        with_relation: withRelation === 'true',
      });
    } else {
      lookingForPet = await this.lookingForPetsRepository.findById({
        id,
        with_relation: false,
      });
    }

    if (!lookingForPet) {
      throw new AppError('Pet not found!', 404);
    }

    let tutor: Tutor;
    if (lookingForPet.tutor_id) {
      tutor = await this.tutorsRepository.findById(lookingForPet.tutor_id);
    }

    let user: User;
    if (lookingForPet.user_id) {
      user = await this.usersRepository.findById(lookingForPet.user_id);
    }

    const lookingForPetResponse = LookingForPetMap.toDTO({
      pets: lookingForPet,
      tutor,
      user,
    });

    return { pet: lookingForPetResponse };
  }
}
