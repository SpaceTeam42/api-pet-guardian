import { Repository } from 'typeorm';

import { postgresDataSource } from '@infra/database/typeorm/connections/postgres-connection';

import { ICreatePetImageDTO } from '@domain/pet-guardian/application/dtos/create-pet-image-dto';

import { IPetImagesRepository } from '@domain/pet-guardian/application/repositories/v1/pet-imagens-repository';

import { PetImage } from '@infra/database/typeorm/entities/PetImage';

export class PetImagesRepository implements IPetImagesRepository {
  private ormRepository: Repository<PetImage>;

  constructor() {
    this.ormRepository = postgresDataSource.getRepository(PetImage);
  }

  async create({ pet_id, image }: ICreatePetImageDTO): Promise<PetImage> {
    const petsImage = this.ormRepository.create({ pet_id, image });

    await this.ormRepository.save(petsImage);

    return petsImage;
  }

  async findAllPetId(petId: string): Promise<PetImage[]> {
    const petImages = await this.ormRepository.find({
      where: { pet_id: petId },
    });

    return petImages;
  }

  async findById(id: string): Promise<PetImage> {
    const petImage = await this.ormRepository.findOne({ where: { id } });

    return petImage;
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}
