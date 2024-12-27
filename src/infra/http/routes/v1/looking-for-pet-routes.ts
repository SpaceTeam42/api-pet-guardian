import { FastifyInstance } from 'fastify';

import { createLookingForPetController } from '@infra/http/controllers/v1/create-looking-for-pet-controller';
import { createLookingForPetImagesController } from '@infra/http/controllers/v1/create-looking-for-pet-imagens-controller';

import { listLookingForPetsController } from '@infra/http/controllers/v1/list-looking-for-pets-controller';
import { listLookingForPetsByTutorIdController } from '@infra/http/controllers/v1/list-looking-for-pets-tutor-id-controller';
import { showLookingForPetController } from '@infra/http/controllers/v1/show-looking-for-pet-controller';

import { updateLookingForPetController } from '@infra/http/controllers/v1/update-looking-for-pet-controller';
import { updateAvatarLookingForPetController } from '@infra/http/controllers/v1/update-avatar-looking-for-pet-controller';

import { deleteLookingForPetController } from '@infra/http/controllers/v1/delete-looking-for-pet-controller';
import { deleteLookingForPetImageController } from '@infra/http/controllers/v1/delete-looking-for-pet-image-controller';

export async function lookingForPetRoutes(app: FastifyInstance) {
  app.post('/', createLookingForPetController);
  app.post('/addImages/:id', createLookingForPetImagesController);

  app.get('/', listLookingForPetsController);
  app.get('/tutor', listLookingForPetsByTutorIdController);
  app.get('/show', showLookingForPetController);

  app.put('/', updateLookingForPetController);

  app.patch('/avatar/:id', updateAvatarLookingForPetController);

  app.delete('/:id', deleteLookingForPetController);
  app.delete('/image/:image_id', deleteLookingForPetImageController);
}
