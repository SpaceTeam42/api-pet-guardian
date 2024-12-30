import { inject, injectable } from 'tsyringe';

import uploadConfig from '@config/upload';

import { AppError } from '@core/errors/AppError';

import { IStorage } from '../../storage/storage';

import { IPetsRepository } from '../../repositories/v1/pets-repository';
import { IPetImagesRepository } from '../../repositories/v1/pet-imagens-repository';

interface IRequest {
  id: string;
}

@injectable()
export class DeletePetUseCase {
  constructor(
    @inject('PetsRepository')
    private petsRepository: IPetsRepository,

    @inject('PetImagesRepository')
    private petImagesRepository: IPetImagesRepository,

    @inject('StorageProvider')
    private storageProvider: IStorage,
  ) {}

  async execute({ id }: IRequest): Promise<void> {
    const pet = await this.petsRepository.findById({ id });

    if (!pet) {
      throw new AppError('Pet not found!', 404);
    }

    if (pet.avatar) {
      await this.storageProvider.delete(pet.avatar, uploadConfig.petsFolder);
    }

    // DELETE IMAGES IF EXISTS
    const petImages = await this.petImagesRepository.findAllPetId(pet.id);

    if (petImages.length > 0) {
      for await (const image of petImages) {
        await this.storageProvider.delete(image.image, uploadConfig.petsFolder);

        await this.petImagesRepository.delete(image.id);
      }
    }

    // DELETE PET
    await this.petsRepository.delete(id);
  }
}
