import { inject, injectable } from 'tsyringe';

import uploadConfig from '@config/upload';

import { AppError } from '@core/errors/AppError';

import { IPetsRepository } from '../../repositories/v1/pets-repository';
import { IStorage } from '../../storage/storage';

import { Pet } from '@infra/database/typeorm/entities/Pet';

interface IRequest {
  id: string;
  avatarFilename: string;
}

interface IResponse {
  pet: Pet;
}

@injectable()
export class UpdateAvatarPetUseCase {
  constructor(
    @inject('PetsRepository')
    private petsRepository: IPetsRepository,

    @inject('StorageProvider')
    private storageProvider: IStorage,
  ) {}

  async execute({ id, avatarFilename }: IRequest): Promise<IResponse> {
    const pet = await this.petsRepository.findById({ id });

    if (!pet) {
      throw new AppError('Pet not found!', 404);
    }

    if (!avatarFilename) {
      throw new AppError('The new photo not informed!', 400);
    }

    if (pet.avatar) {
      await this.storageProvider.delete(pet.avatar, uploadConfig.petsFolder);
    }

    const newAvatar = await this.storageProvider.save(
      avatarFilename,
      uploadConfig.petsFolder,
    );

    pet.avatar = newAvatar;

    await this.petsRepository.save(pet);

    return { pet };
  }
}
