import { MongoClient, Db, Collection } from 'mongodb';
import { AppError, DbError, MissingEnvError } from './util/appError';
import { IUser } from './models/user.db';
import { IUrl } from './models/url.db';
import dotenv from 'dotenv';

let dbConnection: Db;
let userCollection: Collection<IUser>;
let urlCollection: Collection<IUrl>;
let client: MongoClient;

dotenv.config();

/**
 * Establish connection to DB.
 */
export const connectToDatabase = async (uri: string) => {
  try {
    if (!process.env.DB_NAME || !process.env.USER_COLLECTION_NAME || !process.env.URL_COLLECTION_NAME) {
      throw new MissingEnvError();
    }

    client = new MongoClient(uri);
    await client.connect();

    dbConnection = client.db(process.env.DB_NAME);
    userCollection = dbConnection.collection(process.env.USER_COLLECTION_NAME);
    urlCollection = dbConnection.collection(process.env.URL_COLLECTION_NAME);

    console.log(`Successfully connected to database: ${dbConnection.databaseName}.`);
  } catch (e: any) {
    if (e instanceof AppError) {
      throw e;
    } else {
      throw new DbError('Could not connect to DB.');
    }
  }
};

/**
 *
 */
export const disconnect = async () => {
  await client.close();
};

export const getUserCollection = (): Collection<IUser> => userCollection;
export const getUrlCollection = (): Collection<IUrl> => urlCollection;
