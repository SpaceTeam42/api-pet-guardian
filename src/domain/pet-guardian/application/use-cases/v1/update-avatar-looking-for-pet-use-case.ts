import { inject, injectable } from 'tsyringe';

import uploadConfig from '@config/upload';

import { AppError } from '@core/errors/AppError';

import { ILookingForPetsRepository } from '../../repositories/v1/looking-for-pets-repository';
import { IStorage } from '../../storage/storage';

import { LookingForPet } from '@infra/database/typeorm/entities/LookingForPet';

interface IRequest {
  id: string;
  avatarFilename: string;
}

interface IResponse {
  pet: LookingForPet;
}

@injectable()
export class UpdateAvatarLookingForPetPetUseCase {
  constructor(
    @inject('LookingForPetsRepository')
    private lookingForPetRepository: ILookingForPetsRepository,

    @inject('StorageProvider')
    private storageProvider: IStorage,
  ) {}

  async execute({ id, avatarFilename }: IRequest): Promise<IResponse> {
    const pet = await this.lookingForPetRepository.findById({ id });

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

    await this.lookingForPetRepository.save(pet);

    return { pet };
  }
}
