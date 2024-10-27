import { container } from 'tsyringe';

import { Encrypter } from '@domain/pet-guardian/application/cryptography/encrypter';

import { IHashComparer } from '@domain/pet-guardian/application/cryptography/hash-comparer';

import { IHashGenerator } from '@domain/pet-guardian/application/cryptography/hash-generator';

import { BcrypterHasher } from '@infra/cryptography/bcrypter-hasher';

import { JwtEncrypter } from '@infra/cryptography/jwt-encrypter';

// HASH COMPARE AND GENERATOR
container.registerSingleton<IHashComparer>(
  'HashComparerProvider',
  BcrypterHasher,
);

container.registerSingleton<IHashGenerator>(
  'HashGeneratorProvider',
  BcrypterHasher,
);

// JWT
container.registerSingleton<Encrypter>('EncrypterProvider', JwtEncrypter);
