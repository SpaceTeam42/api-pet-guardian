import { inject, injectable } from 'tsyringe';

import { AppError } from '@core/errors/AppError';

import { IPetsRepository } from '../../repositories/v1/pets-repository';

import { Pet } from '@infra/database/typeorm/entities/Pet';

interface IRequest {
  id: string;
  withRelation?: string;
}

interface IResponse {
  pet: Pet;
}

const WITH_RELATION_DEFAULT_VALUE = 'true';

@injectable()
export class ShowPetUseCase {
  constructor(
    @inject('PetsRepository')
    private petsRepository: IPetsRepository,
  ) {}

  async execute({
    id,
    withRelation = WITH_RELATION_DEFAULT_VALUE,
  }: IRequest): Promise<IResponse> {
    const pet = await this.petsRepository.findById({
      id,
      with_relation: withRelation === 'true',
    });

    if (!pet) {
      throw new AppError('Pet not found', 404);
    }

    return { pet };
  }
}
