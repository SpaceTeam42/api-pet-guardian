import 'reflect-metadata';

import multer from 'fastify-multer';

import cors from '@fastify/cors';

import fastify from 'fastify';

import '@infra/database/typeorm';

import '@infra/http/containers';

import { jwtModule } from '@infra/auth/jwt-module';

import { appRoutes } from './routes';

export const app = fastify();

// MULTER
app.register(multer.contentParser);

// CORES
app.register(cors, {
  exposedHeaders: ['x-total-count-registers'],
});

// ROUTES
app.register(appRoutes);

jwtModule(app);
