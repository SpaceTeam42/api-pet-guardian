import { FastifyInstance } from 'fastify';

import multer from 'fastify-multer';

import { createTutorController } from '@infra/http/controllers/v1/create-tutor-controller';

export async function tutorRoutes(app: FastifyInstance) {
  const upload = multer();

  app.post(
    '/',
    {
      preHandler: upload.single('avatar'),
    },
    createTutorController,
  );
}
