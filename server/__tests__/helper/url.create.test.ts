import { ObjectId } from 'mongodb';
import { getUrlCollection } from '../../src/db';
import { createUrl } from '../../src/helper/url.create';

beforeEach(async () => {
  // Clear URL Collection before each test.
  await getUrlCollection().deleteMany();
});

const MOCK_ORIGINAL_URL = 'mock-original-url';
const MOCK_USER_ID = new ObjectId();
const MOCK_USER_ID_2 = new ObjectId();

describe('Test createUrl()', () => {
  it('should create different shortened URLs for the same original URL from different users', async () => {
    const shortenedUrl1: string = await createUrl(MOCK_ORIGINAL_URL, MOCK_USER_ID);
    const shortenedUrl2: string = await createUrl(MOCK_ORIGINAL_URL, MOCK_USER_ID_2);
    expect(shortenedUrl1).not.toBe(shortenedUrl2);
  });

  it('should throw error when user shortens same URL twice', async () => {
    await createUrl(MOCK_ORIGINAL_URL, MOCK_USER_ID);
    await expect(createUrl(MOCK_ORIGINAL_URL, MOCK_USER_ID)).rejects.toThrow();
  });
});
