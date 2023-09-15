import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectToDatabase } from './db';

dotenv.config();

/**
 * Create and start express server
 */
const serveApp = async () => {
  const app: Express = express();
  const port = process.env.PORT;
  await connectToDatabase();
  app.get('/', (req: Request, res: Response) => {
    res.send('URL Shortener');
  });
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
}

serveApp();
