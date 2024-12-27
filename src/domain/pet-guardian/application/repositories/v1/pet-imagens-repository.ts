import { ICreatePetImageDTO } from '../../dtos/create-pet-image-dto';

import { PetImage } from '@infra/database/typeorm/entities/PetImage';

export interface IPetImagesRepository {
  create({ pet_id, image }: ICreatePetImageDTO): Promise<PetImage>;
  findAllPetId(petId: string): Promise<PetImage[]>;
  findById(id: string): Promise<PetImage>;
  delete(id: string): Promise<void>;
}
