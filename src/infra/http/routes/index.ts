import { FastifyInstance } from 'fastify';

import { userRoutes } from './v1/user-routes';
import { authenticateUserRoutes } from './v1/authenticate-user-routes';

import { tutorRoutes } from './v1/tutor-routes';
import { authenticateTutorRoutes } from './v1/authenticate-tutor-routes';

import { categoryRoutes } from './v1/category-routes';

// PETS

import { petRoutes } from './v1/pet-routes';
import { lookingForPetRoutes } from './v1/looking-for-pet-routes';

export async function appRoutes(app: FastifyInstance) {
  // SECTION - USERS

  app.register(userRoutes, {
    prefix: '/v1/users',
  });

  app.register(authenticateUserRoutes, {
    prefix: '/v1/authenticate_user',
  });

  // SECTION - TUTORS

  app.register(tutorRoutes, {
    prefix: '/v1/tutors',
  });

  app.register(authenticateTutorRoutes, {
    prefix: '/v1/authenticate_tutor',
  });

  // SECTION - CATEGORIES

  app.register(categoryRoutes, {
    prefix: '/v1/categories',
  });

  // SECTION - PETS

  app.register(petRoutes, {
    prefix: '/v1/pets',
  });

  // SECTION - LOOKING FOR PETS
  app.register(lookingForPetRoutes, {
    prefix: '/v1/looking_for_pets',
  });
}
