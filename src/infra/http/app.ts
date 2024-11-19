import 'reflect-metadata';

import multer from 'fastify-multer';

import cors from '@fastify/cors';

import fastify from 'fastify';

import { ZodError } from 'zod';

import { fromZodError } from 'zod-validation-error';

import { jwtModule } from '@infra/auth/jwt-module';

import { AppError } from '@core/errors/AppError';

import { env } from '../env';

import axios, { AxiosError } from 'axios';

import '@infra/database/typeorm';

import '@infra/http/containers';

import { appRoutes } from './routes';

export const app = fastify();

// CORS
app.register(cors, {
  exposedHeaders: ['x-total-count-registers'],
});

// MULTER
app.register(multer.contentParser);

// ROUTES
app.register(appRoutes);

jwtModule(app);

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    const messageError = {
      message: 'Invalid environment variables!',
      error: fromZodError(error),
    };

    return reply.status(400).send(messageError);
  }

  if (error instanceof AppError) {
    const messageError = {
      message: error.message,
    };

    return reply.status(error.statusCode).send(messageError);
  }

  const isAxiosError = axios.isAxiosError(error);

  if (isAxiosError) {
    const axiosError = error as AxiosError;

    const messageError = {
      message: error.message,
      error: axiosError.response?.data,
    };

    return reply.status(400).send(messageError);
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  } else {
    // TODO - Here we should log to on external tool like Datadog/NewRelic/Sentry
    // ferramenta de observabilidade
  }

  return reply.status(500).send({
    message: 'Internal server error',
  });
});
