import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../db';
import { getUrl, insertUrl } from '../models/url.db';

beforeAll(async () => {
  await connectToDatabase();
});

describe('Server.ts tests', () => {
  it('should work', async () => {
    const res = insertUrl({ shortenedUrl: 'eee', originalUrl: 'fff', userId: new ObjectId() });
    const find = await getUrl('eee');
    expect(find).toBe('ggg');
  });
});
