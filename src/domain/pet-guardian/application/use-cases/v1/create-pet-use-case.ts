import { inject, injectable } from 'tsyringe';

import { AppError } from '@core/errors/AppError';

import { ICategoriesRepository } from '../../repositories/v1/categories-repository';

import { ITutorsRepository } from '../../repositories/v1/tutors-repository';

import { IPetsRepository } from '../../repositories/v1/pets-repository';

import { Pet } from '@infra/database/typeorm/entities/Pet';

interface IRequest {
  name: string;
  birthday: string;
  breed: string;
  category_id: string;
  gender: string;
  size: string;
  weight: string;
  city: string;
  state: string;
  tutor_id: string;
  description: string;
}

interface IResponse {
  pet: Pet;
}

@injectable()
export class CreatePetUseCase {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,

    @inject('TutorsRepository')
    private tutorsRepository: ITutorsRepository,

    @inject('PetsRepository')
    private petsRepository: IPetsRepository,
  ) {}

  async execute({
    name,
    birthday,
    breed,
    category_id,
    gender,
    size,
    weight,
    city,
    state,
    tutor_id,
    description,
  }: IRequest): Promise<IResponse> {
    const category = await this.categoriesRepository.findById(category_id);

    if (!category) {
      throw new AppError('Category not found!', 404);
    }

    const tutor = await this.tutorsRepository.findById(tutor_id);

    if (!tutor) {
      throw new AppError('Tutor not found!', 404);
    }

    if (Pet.getPetGenderEnum(gender) === '') {
      throw new AppError('Gender is not valid!', 400);
    }

    if (Pet.getPetSizeEnum(size) === '') {
      throw new AppError('Size is not valid!', 400);
    }

    const [ano, mes, dia] = birthday.split('-').map((v) => parseInt(v));

    const pet = await this.petsRepository.create({
      name,
      birthday: new Date(ano, mes - 1, dia),
      breed,
      category_id,
      gender: Pet.getPetGenderEnum(gender),
      size: Pet.getPetSizeEnum(size),
      weight,
      city,
      state,
      tutor_id,
      description,
    });

    return { pet };
  }
}
