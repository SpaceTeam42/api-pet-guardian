import { inject, injectable } from 'tsyringe';

import { AppError } from '@core/errors/AppError';

import { ILookingForPetsRepository } from '../../repositories/v1/looking-for-pets-repository';

import { LookingForPet } from '@infra/database/typeorm/entities/LookingForPet';

interface IRequest {
  id: string;
  name_pet: string;
  breed: string;
  gender: string;
  category_id: string;
  name_tutor: string;
  phone_tutor: string;
  phone_tutor_is_whatsapp: boolean;
  last_seen: string;
  description: string;
  is_found: boolean;
  is_reward: boolean;
  reward_amount: number;
  state: string;
  city: string;
  enabled: boolean;
}

interface IResponse {
  pet: LookingForPet;
}

@injectable()
export class UpdateLookingForPetUseCase {
  constructor(
    @inject('LookingForPetsRepository')
    private lookingForPetsRepository: ILookingForPetsRepository,
  ) {}

  async execute({
    id,
    name_pet,
    breed,
    gender,
    category_id,
    name_tutor,
    phone_tutor,
    phone_tutor_is_whatsapp,
    last_seen,
    description,
    is_found,
    is_reward,
    reward_amount,
    state,
    city,
    enabled,
  }: IRequest): Promise<IResponse> {
    const lookingForPet = await this.lookingForPetsRepository.findById({ id });

    if (!lookingForPet) {
      throw new AppError('Pet not found!', 404);
    }

    if (LookingForPet.getPetGenderEnum(gender) === '') {
      throw new AppError('Gender invalid!', 400);
    }

    lookingForPet.name_pet = name_pet;
    lookingForPet.breed = breed;
    lookingForPet.gender = LookingForPet.getPetGenderEnum(gender);
    lookingForPet.category_id = category_id;
    lookingForPet.name_tutor = name_tutor;
    lookingForPet.phone_tutor = phone_tutor;
    lookingForPet.phone_tutor_is_whatsapp = phone_tutor_is_whatsapp;
    lookingForPet.last_seen = last_seen;
    lookingForPet.description = description;
    lookingForPet.is_found = is_found;
    lookingForPet.is_reward = is_reward;
    lookingForPet.reward_amount = reward_amount;
    lookingForPet.state = state;
    lookingForPet.city = city;
    lookingForPet.enabled = enabled;

    await this.lookingForPetsRepository.save(lookingForPet);

    return { pet: lookingForPet };
  }
}
