import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectToDatabase } from './db';
import { AppError, MissingEnvError } from './util/appError';
import userRouter from './routes/user';
import urlRouter from './routes/url';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { makeApp } from './app';

dotenv.config();

/**
 * Create and start express server
 */
const serveApp = async () => {
  if (!process.env.DB_CONN_STRING) {
    throw new MissingEnvError();
  }
  const app: Express = makeApp();
  const port = process.env.PORT;
  await connectToDatabase(process.env.DB_CONN_STRING);

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
};

serveApp();
