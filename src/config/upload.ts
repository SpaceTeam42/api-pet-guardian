import crypto from 'node:crypto';
import path from 'node:path';

import { env } from '@infra/env';

import fs from 'node:fs';

// import multer from 'fastify-multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface ICreateFileUpload {
  createWriteStream: fs.WriteStream;
  fileNameFormatted: string;
}

interface IUploadConfig {
  driver: 'disk' | 's3';

  tmpFolder: string;
  usersFolder: string;
  tutorsFolder: string;
  petsFolder: string;
  categoriesFolder: string;
  writersFolder: string;
  newsFolder: string;

  createFileUpload: (fileName: string) => ICreateFileUpload;

  // multer: {
  //   storage: any;
  // };
}

export default {
  driver: env.STORAGE_DRIVER,

  tmpFolder,
  usersFolder: 'users_img',
  tutorsFolder: 'tutors_img',
  petsFolder: 'pets_img',
  categoriesFolder: 'categories_img',
  writersFolder: 'writers_img',
  newsFolder: 'news_img',

  createFileUpload: (fileName) => {
    const fileHash = crypto.randomBytes(10).toString('hex');

    const fileNameFormatted = `${fileHash}-${fileName}`.replace(/\s/g, '');

    const createWriteStream = fs.createWriteStream(
      `${tmpFolder}/${fileNameFormatted}`,
    );

    return {
      createWriteStream,
      fileNameFormatted,
    };
  },

  // multer: {
  //   storage: multer.diskStorage({
  //     destination: tmpFolder,
  //     filename(request, file, callback) {
  //       const fileHash = crypto.randomBytes(10).toString('hex');
  //       const fileName = `${fileHash}-${file.originalname}`.replace(/\s/g, '');

  //       return callback(null, fileName);
  //     },
  //   }),
  // },
} as IUploadConfig;
