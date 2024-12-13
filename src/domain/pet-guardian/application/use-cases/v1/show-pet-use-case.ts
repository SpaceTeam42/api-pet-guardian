import { inject, injectable } from 'tsyringe';

import { IPetsRepository } from '../../repositories/v1/pets-repository';

@injectable()
export class ShowPetUseCase {
  constructor(
    @inject('PetsRepository')
    private petsRepository: IPetsRepository,
  ) {}
}
