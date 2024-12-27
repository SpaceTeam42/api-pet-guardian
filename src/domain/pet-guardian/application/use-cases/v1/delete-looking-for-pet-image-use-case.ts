import { inject, injectable } from 'tsyringe';

import { AppError } from '@core/errors/AppError';

import uploadConfig from '@config/upload';

import { IStorage } from '../../storage/storage';

import { ILookingForPetImagesRepository } from '../../repositories/v1/looking-for-pet-images-repository';

interface IRequest {
  id: string;
}

@injectable()
export class DeleteLookingForPetImageUseCase {
  constructor(
    @inject('LookingForPetImagesRepository')
    private lookingForPetImagesRepository: ILookingForPetImagesRepository,

    @inject('StorageProvider')
    private storageProvider: IStorage,
  ) {}

  async execute({ id }: IRequest): Promise<void> {
    const lookingForPetImage =
      await this.lookingForPetImagesRepository.findById(id);

    if (!lookingForPetImage) {
      throw new AppError('Image not found!', 404);
    }

    await this.storageProvider.delete(
      lookingForPetImage.image,
      uploadConfig.petsFolder,
    );

    await this.lookingForPetImagesRepository.delete(id);
  }
}
