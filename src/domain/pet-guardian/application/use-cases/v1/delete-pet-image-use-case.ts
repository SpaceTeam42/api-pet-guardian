import { inject, injectable } from 'tsyringe';

import uploadConfig from '@config/upload';

import { AppError } from '@core/errors/AppError';

import { IStorage } from '../../storage/storage';

import { IPetImagesRepository } from '../../repositories/v1/pet-imagens-repository';

interface IRequest {
  id: string;
}

@injectable()
export class DeletePetImageUseCase {
  constructor(
    @inject('PetImagesRepository')
    private petImagesRepository: IPetImagesRepository,

    @inject('StorageProvider')
    private storageProvider: IStorage,
  ) {}

  async execute({ id }: IRequest) {
    const petImage = await this.petImagesRepository.findById(id);

    if (!petImage) {
      throw new AppError('Image not found!', 404);
    }

    if (petImage.image) {
      await this.storageProvider.delete(
        petImage.image,
        uploadConfig.petsFolder,
      );
    }

    await this.petImagesRepository.delete(id);
  }
}
