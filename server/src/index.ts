import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectToDatabase } from './db';
import { AppError } from './util/appError';
import userRouter from './routes/user';
import urlRouter from './routes/url';
import cookieParser from 'cookie-parser';

dotenv.config();

/**
 * Create and start express server
 */
const serveApp = async () => {
  const app: Express = express();
  const port = process.env.PORT;
  await connectToDatabase();
  app.use(express.json());
  app.use(cookieParser());
  app.get('/', (req: Request, res: Response) => {
    res.send('URL Shortener');
  });
  app.use('/api/user', userRouter);
  app.use('/api/url', urlRouter);
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    if (err instanceof AppError) {
      return res.status(err.statusCode).send(err.message);
    } else {
      return res.sendStatus(500);
    }
  });
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
};

serveApp();
