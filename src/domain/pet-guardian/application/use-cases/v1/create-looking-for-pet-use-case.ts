import { inject, injectable } from 'tsyringe';

import { AppError } from '@core/errors/AppError';

import { ILookingForPetsRepository } from '../../repositories/v1/looking-for-pets-repository';

import { LookingForPet } from '@infra/database/typeorm/entities/LookingForPet';
import { ITutorsRepository } from '../../repositories/v1/tutors-repository';
import { IUsersRepository } from '../../repositories/v1/users-repository';

interface IRequest {
  name_pet: string;
  breed: string;
  gender: string;
  category_id: string;
  name_tutor: string;
  phone_tutor: string;
  phone_tutor_is_whatsapp: boolean;
  last_seen: string;
  description: string;
  is_reward?: boolean;
  reward_amount: number;
  state: string;
  city: string;
  tutor_id?: string | null;
  user_id?: string | null;
}

interface IResponse {
  pet: LookingForPet;
}

@injectable()
export class CreateLookingForPetUseCase {
  constructor(
    @inject('LookingForPetsRepository')
    private lookingForPetsRepository: ILookingForPetsRepository,

    @inject('TutorsRepository')
    private tutorsRepository: ITutorsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({
    name_pet,
    breed,
    gender,
    category_id,
    name_tutor,
    phone_tutor,
    phone_tutor_is_whatsapp,
    last_seen,
    description,
    is_reward,
    reward_amount,
    state,
    city,
    tutor_id,
    user_id,
  }: IRequest): Promise<IResponse> {
    if (tutor_id) {
      const tutor = await this.tutorsRepository.findById(tutor_id);

      if (!tutor) {
        throw new AppError('Tutor not found!', 404);
      }
    }

    if (user_id) {
      const user = await this.usersRepository.findById(user_id);

      if (!user) {
        throw new AppError('User not found!', 404);
      }
    }

    if (LookingForPet.getPetGenderEnum(gender) === '') {
      throw new AppError('Gender is not valid!', 400);
    }

    const lookingForPet = await this.lookingForPetsRepository.create({
      name_pet,
      breed,
      gender: LookingForPet.getPetGenderEnum(gender),
      category_id,
      name_tutor,
      phone_tutor,
      phone_tutor_is_whatsapp,
      last_seen,
      description,
      is_found: false,
      is_reward,
      reward_amount,
      state,
      city,
      tutor_id,
      user_id,
      enabled: true,
    });

    return { pet: lookingForPet };
  }
}
