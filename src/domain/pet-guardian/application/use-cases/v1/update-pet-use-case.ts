import { inject, injectable } from 'tsyringe';

import { AppError } from '@core/errors/AppError';

import { ITutorsRepository } from '../../repositories/v1/tutors-repository';
import { IPetsRepository } from '../../repositories/v1/pets-repository';

import { Pet } from '@infra/database/typeorm/entities/Pet';

interface IRequest {
  id: string;
  name: string;
  birthday: string;
  breed: string;
  category_id: string;
  gender: string;
  size: string;
  weight: string;
  tutor_id: string;
  description: string;
  city: string;
  state: string;
}

interface IResponse {
  pet: Pet;
}

@injectable()
export class UpdatePetUseCase {
  constructor(
    @inject('PetsRepository')
    private petsRepository: IPetsRepository,

    @inject('TutorsRepository')
    private tutorsRepository: ITutorsRepository,
  ) {}

  async execute({
    id,
    name,
    birthday,
    breed,
    category_id,
    gender,
    size,
    weight,
    tutor_id,
    description,
    city,
    state,
  }: IRequest): Promise<IResponse> {
    const pet = await this.petsRepository.findById({
      id,
      with_relation: false,
    });

    if (!pet) {
      throw new AppError('Pet not found!', 404);
    }

    const tutor = await this.tutorsRepository.findById(tutor_id);

    if (!tutor) {
      throw new AppError('Tutor not found!', 404);
    }

    if (Pet.getPetGenderEnum(gender) === '') {
      throw new AppError('Gender incorrect!', 400);
    }

    if (Pet.getPetSizeEnum(size) === '') {
      throw new AppError('Size incorrect!', 400);
    }

    const [ano, mes, dia] = birthday.split('-').map((v) => parseInt(v));

    pet.name = name;
    pet.birthday = new Date(ano, mes - 1, dia);
    pet.breed = breed;
    pet.category_id = category_id;
    pet.gender = gender;
    pet.size = size;
    pet.weight = weight;
    pet.tutor_id = tutor_id;
    pet.description = description;
    pet.city = city;
    pet.state = state;

    await this.petsRepository.save(pet);

    const petResult = await this.petsRepository.findById({
      id,
      with_relation: true,
    });

    return { pet: petResult };
  }
}
