import { inject, injectable } from 'tsyringe';

import uploadConfig from '@config/upload';

import { AppError } from '@core/errors/AppError';

import { IStorage } from '../../storage/storage';

import { ILookingForPetImagesRepository } from '../../repositories/v1/looking-for-pet-images-repository';
import { ILookingForPetsRepository } from '../../repositories/v1/looking-for-pets-repository';

import { LookingForPetImage } from '@infra/database/typeorm/entities/LookingForPetImage';

interface IRequest {
  id: string;
  images: string[];
}

interface IResponse {
  lookingForPetImages: LookingForPetImage[];
}

@injectable()
export class CreateLookingForPetImagesUseCase {
  constructor(
    @inject('LookingForPetImagesRepository')
    private lookingForPetImagesRepository: ILookingForPetImagesRepository,

    @inject('LookingForPetsRepository')
    private lookingForPetsRepository: ILookingForPetsRepository,

    @inject('StorageProvider')
    private storageProvider: IStorage,
  ) {}

  async execute({ id, images }: IRequest): Promise<IResponse> {
    const lookingForPet = await this.lookingForPetsRepository.findById({ id });

    if (!lookingForPet) {
      throw new AppError('Pet not found', 404);
    }

    const lookingForPetImages: LookingForPetImage[] = [];

    if (images.length > 0) {
      for await (const image of images) {
        await this.storageProvider.save(image, uploadConfig.petsFolder);

        const petImageGallery = await this.lookingForPetImagesRepository.create(
          {
            looking_for_pet_id: lookingForPet.id,
            image,
          },
        );

        lookingForPetImages.push(petImageGallery);
      }
    }

    return { lookingForPetImages };
  }
}
