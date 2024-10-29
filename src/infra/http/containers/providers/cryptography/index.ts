import { container } from 'tsyringe';

import { IHashComparer } from '@domain/pet-guardian/application/cryptography/hash-comparer';

import { IHashGenerator } from '@domain/pet-guardian/application/cryptography/hash-generator';

import { BcrypterHasher } from '@infra/cryptography/bcrypter-hasher';

// HASH COMPARE AND GENERATOR
container.registerSingleton<IHashComparer>(
  'HashComparerProvider',
  BcrypterHasher,
);

container.registerSingleton<IHashGenerator>(
  'HashGeneratorProvider',
  BcrypterHasher,
);
