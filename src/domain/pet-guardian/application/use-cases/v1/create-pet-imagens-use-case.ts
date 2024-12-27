import { inject, injectable } from 'tsyringe';

import uploadConfig from '@config/upload';

import { AppError } from '@core/errors/AppError';

import { IStorage } from '../../storage/storage';

import { IPetsRepository } from '../../repositories/v1/pets-repository';
import { IPetImagesRepository } from '../../repositories/v1/pet-imagens-repository';

import { PetImage } from '@infra/database/typeorm/entities/PetImage';

interface IRequest {
  id: string;
  images: string[];
}

interface IResponse {
  petImages: PetImage[];
}

@injectable()
export class CreatePetImagesUseCase {
  constructor(
    @inject('PetImagesRepository')
    private petImagesRepository: IPetImagesRepository,

    @inject('PetsRepository')
    private petsRepository: IPetsRepository,

    @inject('StorageProvider')
    private storageProvider: IStorage,
  ) {}

  async execute({ id, images }: IRequest): Promise<IResponse> {
    const pet = await this.petsRepository.findById({ id });

    if (!pet) {
      throw new AppError('Pet not found', 404);
    }

    const petImages: PetImage[] = [];

    if (images.length > 0) {
      for await (const image of images) {
        await this.storageProvider.save(image, uploadConfig.petsFolder);

        const petImageGallery = await this.petImagesRepository.create({
          pet_id: pet.id,
          image,
        });

        petImages.push(petImageGallery);
      }
    }

    return { petImages };
  }
}
