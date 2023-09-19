import request from 'supertest';
import { makeApp } from '../../src/app';
import { insertUrl } from '../../src/models/url.db';
import { ObjectId } from 'mongodb';
import { getUrlCollection } from '../../src/db';

const app = makeApp();

const MOCK_ORIGINAL_URL = 'mock-original-url';
const MOCK_SHORT_URL = 'mock-short-url';
const MOCK_USER_ID = new ObjectId();

beforeEach(async () => {
  // Clear URL Collection before each test.
  await getUrlCollection().deleteMany();
});

describe('GET /api/url/:shortenedUrl', () => {
  it('should redirect to original URL', async () => {
    await insertUrl({
      shortenedUrl: MOCK_SHORT_URL,
      originalUrl: MOCK_ORIGINAL_URL,
      userId: MOCK_USER_ID,
    });
    const res = await request(app).get(`/api/url/${MOCK_SHORT_URL}`);
    expect(res.statusCode).toBe(302);
  });

  it('should throw a 404 error for URL that does not exist', async () => {
    const res = await request(app).get(`/api/url/${MOCK_SHORT_URL}`);
    expect(res.statusCode).toBe(404);
  });
});
