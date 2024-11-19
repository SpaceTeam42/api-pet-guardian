import { container } from 'tsyringe';

import uploadConfig from '@config/upload';

import { IStorage } from '@domain/pet-guardian/application/storage/storage';

import { DiskStorage } from '@infra/storage/disk-storage';

// import { S3Storage } from '@infra/storage/s3-storage';

const provider = {
  disk: DiskStorage,
  // s3: DiskStorage,
};

container.registerSingleton<IStorage>(
  'StorageProvider',
  provider[uploadConfig.driver],
);
