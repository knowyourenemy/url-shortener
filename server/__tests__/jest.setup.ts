import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectToDatabase, disconnect } from '../src/db';

const mongoMemoryServer = new MongoMemoryServer();
beforeAll(async () => {
  await mongoMemoryServer.start();
  await connectToDatabase(mongoMemoryServer.getUri());
});

afterAll(async () => {
  await mongoMemoryServer.stop();
  await disconnect();
});
