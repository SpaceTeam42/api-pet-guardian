import { container } from 'tsyringe';

import './providers';

// USERS
import { IUsersRepository } from '@domain/pet-guardian/application/repositories/v1/users-repository';
import { UsersRepository } from '@infra/database/repositories/typeorm/typeorm-users-repository';

import { IUsersRefreshesTokensRepository } from '@domain/pet-guardian/application/repositories/v1/users-refreshes-tokens-repository';
import { UsersRefreshesTokensRepository } from '@infra/database/repositories/typeorm/typeorm-users-refreshes-tokens-repository';

import { IUserTokensRepository } from '@domain/pet-guardian/application/repositories/v1/user-tokens-repository';
import { UserTokensRepository } from '@infra/database/repositories/typeorm/typeorm-user-tokens-repository';

// TUTORS
import { ITutorsRepository } from '@domain/pet-guardian/application/repositories/v1/tutors-repository';
import { TutorsRepository } from '@infra/database/repositories/typeorm/typeorm-tutors-repository';

// CATEGORIES
import { ICategoriesRepository } from '@domain/pet-guardian/application/repositories/v1/categories-repository';
import { CategoriesRepository } from '@infra/database/repositories/typeorm/typeorm-categories-repository';

// ADOPTIONS
import { IAdoptionsRepository } from '@domain/pet-guardian/application/repositories/v1/adotions-repository';
import { AdoptionsRepository } from '@infra/database/repositories/typeorm/typeorm-adoptions-repository';

// PETS
import { IPetsRepository } from '@domain/pet-guardian/application/repositories/v1/pets-repository';
import { PetsRepository } from '@infra/database/repositories/typeorm/typeorm-pets-repository';

import { IPetImagesRepository } from '@domain/pet-guardian/application/repositories/v1/pet-imagens-repository';
import { PetImagesRepository } from '@infra/database/repositories/typeorm/typeorm-pet-images-repository';

// LOOKING FOR PETS

import { ILookingForPetsRepository } from '@domain/pet-guardian/application/repositories/v1/looking-for-pets-repository';
import { LookingForPetsRepository } from '@infra/database/repositories/typeorm/typeorm-looking-for-pets-repository';

import { ILookingForPetImagesRepository } from '@domain/pet-guardian/application/repositories/v1/looking-for-pet-images-repository';
import { LookingForPetImagesRepository } from '@infra/database/repositories/typeorm/typeorm-looking-for-pet-images-repository';

// USERS

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUsersRefreshesTokensRepository>(
  'UsersRefreshesTokensRepository',
  UsersRefreshesTokensRepository,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);

// TUTORS

container.registerSingleton<ITutorsRepository>(
  'TutorsRepository',
  TutorsRepository,
);

// CATEGORIES

container.registerSingleton<ICategoriesRepository>(
  'CategoriesRepository',
  CategoriesRepository,
);

// ADOPTIONS

container.registerSingleton<IAdoptionsRepository>(
  'AdoptionsRepository',
  AdoptionsRepository,
);

// PETS

container.registerSingleton<IPetsRepository>('PetsRepository', PetsRepository);

container.registerSingleton<IPetImagesRepository>(
  'PetImagesRepository',
  PetImagesRepository,
);

// LOOKING FOR PETS

container.registerSingleton<ILookingForPetsRepository>(
  'LookingForPetsRepository',
  LookingForPetsRepository,
);

container.register<ILookingForPetImagesRepository>(
  'LookingForPetImagesRepository',
  LookingForPetImagesRepository,
);
