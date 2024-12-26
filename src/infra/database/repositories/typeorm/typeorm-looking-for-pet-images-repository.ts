import { Repository } from 'typeorm';

import { postgresDataSource } from '@infra/database/typeorm/connections/postgres-connection';

import { ICreateLookingForPetImageDTO } from '@domain/pet-guardian/application/dtos/create-looking-for-pet-image-dto';

import { ILookingForPetImagesRepository } from '@domain/pet-guardian/application/repositories/v1/looking-for-pet-images-repository';

import { LookingForPetImage } from '@infra/database/typeorm/entities/LookingForPetImage';

export class LookingForPetImagesRepository
  implements ILookingForPetImagesRepository
{
  private ormRepository: Repository<LookingForPetImage>;

  constructor() {
    this.ormRepository = postgresDataSource.getRepository(LookingForPetImage);
  }

  async create({
    looking_for_pet_id,
    image,
  }: ICreateLookingForPetImageDTO): Promise<LookingForPetImage> {
    const lookingForPetImages = this.ormRepository.create({
      looking_for_pet_id,
      image,
    });

    await this.ormRepository.save(lookingForPetImages);

    return lookingForPetImages;
  }

  async findById(id: string): Promise<LookingForPetImage> {
    const lookingForPetImage = await this.ormRepository.findOne({
      where: { id },
    });

    return lookingForPetImage;
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}
