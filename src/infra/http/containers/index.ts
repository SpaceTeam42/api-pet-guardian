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
