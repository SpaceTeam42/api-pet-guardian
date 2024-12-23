import { instanceToInstance } from 'class-transformer';

import { IRequestLookingForPetMapDTO } from '@domain/pet-guardian/application/dtos/request-looking-for-pet-map-dto';
import { ILookingForPetResponseDTO } from '@domain/pet-guardian/application/dtos/looking-for-pet-response-dto';

export class LookingForPetMap {
  static toDTO({
    pets,
    tutor,
    user,
  }: IRequestLookingForPetMapDTO): ILookingForPetResponseDTO {
    const lookingForPetsInstance = instanceToInstance(pets);
    const tutorInstance = instanceToInstance(tutor);
    const userInstance = instanceToInstance(user);

    const lookingForPetResponse = {
      ...lookingForPetsInstance,
      avatar_url: lookingForPetsInstance.getAvatarUrl(),
      tutor: tutorInstance,
      user: userInstance,
    } as ILookingForPetResponseDTO;

    return lookingForPetResponse;
  }
}
