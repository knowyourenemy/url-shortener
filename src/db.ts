import { MongoClient, Db } from "mongodb";

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
        throw new Error("Missing environment variable");
      }
    const client: MongoClient = new MongoClient(process.env.DB_CONN_STRING);
    await client.connect();
    dbConnection = client.db(process.env.DB_NAME);
    console.log(`Successfully connected to database: ${dbConnection.databaseName}.`);
  } catch (e: any) {
    console.log(e.message)
    throw new Error("Could not connect to DB.");
  }
};
