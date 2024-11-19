import crypto from 'crypto';
import path from 'path';

import multer from 'fastify-multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  driver: 'disk' | 's3';

  tmpFolder: string;
  usersFolder: string;
  tutorsFolder: string;
  petsFolder: string;
  categoriesFolder: string;
  writersFolder: string;
  newsFolder: string;

  multer: {
    storage: NonNullable<unknown>;
  };
}

export default {
  driver: process.env.STORAGE_DRIVER,

  tmpFolder,
  usersFolder: 'users_img',
  tutorsFolder: 'tutors_img',
  petsFolder: 'pets_img',
  categoriesFolder: 'categories_img',
  writersFolder: 'writers_img',
  newsFolder: 'news_img',

  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(request, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('hex');
        const fileName = `${fileHash}-${file.originalname}`.replace(/\s/g, '');

        return callback(null, fileName);
      },
    }),
  },
} as IUploadConfig;
