import { MongoClient, Db, Collection } from 'mongodb';
import { AppError, DbError, MissingEnvError } from './util/appError';
import { IUser } from './models/user.db';
import { IUrl } from './models/url.db';

let dbConnection: Db;
let userCollection: Collection<IUser>;
let urlCollection: Collection<IUrl>;

/**
 * Establish connection to DB.
 */
export const connectToDatabase = async () => {
  try {
    if (
      !process.env.DB_CONN_STRING ||
      !process.env.DB_NAME ||
      !process.env.USER_COLLECTION_NAME ||
      !process.env.URL_COLLECTION_NAME
    ) {
      throw new MissingEnvError();
    }
    const client: MongoClient = new MongoClient(process.env.DB_CONN_STRING);
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

export const getUserCollection = (): Collection<IUser> => userCollection;
export const getUrlCollection = (): Collection<IUrl> => urlCollection;