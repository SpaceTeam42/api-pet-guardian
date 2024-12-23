import { Tutor } from '@infra/database/typeorm/entities/Tutor';
import { User } from '@infra/database/typeorm/entities/User';
import { LookingForPet } from '@infra/database/typeorm/entities/LookingForPet';

export type IRequestLookingForPetMapDTO = {
  pets: LookingForPet;
  tutor?: Tutor;
  user?: User;
};
