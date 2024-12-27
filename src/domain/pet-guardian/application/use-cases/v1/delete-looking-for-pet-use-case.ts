import { inject, injectable } from 'tsyringe';

import { AppError } from '@core/errors/AppError';

import uploadConfig from '@config/upload';

import { IStorage } from '../../storage/storage';

import { ILookingForPetsRepository } from '../../repositories/v1/looking-for-pets-repository';
import { ILookingForPetImagesRepository } from '../../repositories/v1/looking-for-pet-images-repository';

interface IRequest {
  id: string;
}

@injectable()
export class DeleteLookingForPetUseCase {
  constructor(
    @inject('LookingForPetsRepository')
    private lookingForPetsRepository: ILookingForPetsRepository,

    @inject('LookingForPetImagesRepository')
    private lookingForPetImagesRepository: ILookingForPetImagesRepository,

    @inject('StorageProvider')
    private storageProvider: IStorage,
  ) {}

  async execute({ id }: IRequest): Promise<void> {
    const lookingForPets = await this.lookingForPetsRepository.findById({ id });

    if (!lookingForPets) {
      throw new AppError('Pet not found!', 404);
    }

    // DELETE IMAGES IF EXISTS
    const lookingForPetImages =
      await this.lookingForPetImagesRepository.findAllByLookingForPetId(
        lookingForPets.id,
      );

    if (lookingForPetImages.length > 0) {
      for await (const image of lookingForPetImages) {
        await this.storageProvider.delete(image.image, uploadConfig.petsFolder);

        await this.lookingForPetImagesRepository.delete(image.id);
      }
    }

    await this.lookingForPetsRepository.delete(id);
  }
}
