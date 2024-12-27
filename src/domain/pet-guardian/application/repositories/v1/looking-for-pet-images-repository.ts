import { ICreateLookingForPetImageDTO } from '../../dtos/create-looking-for-pet-image-dto';

import { LookingForPetImage } from '@infra/database/typeorm/entities/LookingForPetImage';

export interface ILookingForPetImagesRepository {
  create({
    looking_for_pet_id,
    image,
  }: ICreateLookingForPetImageDTO): Promise<LookingForPetImage>;
  findAllByLookingForPetId(
    lookingForPetId: string,
  ): Promise<LookingForPetImage[]>;
  findById(id: string): Promise<LookingForPetImage>;
  delete(id: string): Promise<void>;
}
