import { MongoClient, Db } from "mongodb";
import { AppError, DbError, MissingEnvError } from "./util/appError";

let dbConnection: Db;

/**
 * Establish connection to DB.
 */
export const connectToDatabase = async () => {
    try {
        if (
            !process.env.DB_CONN_STRING ||
            !process.env.DB_NAME
        ) {
            throw new MissingEnvError();
        }
        const client: MongoClient = new MongoClient(process.env.DB_CONN_STRING);
        await client.connect();
        dbConnection = client.db(process.env.DB_NAME);
        console.log(`Successfully connected to database: ${dbConnection.databaseName}.`);
    } catch (e: any) {
        if (e instanceof AppError) {
            throw e;
        } else {
            throw new DbError("Could not connect to DB.");
        }
    }
};
