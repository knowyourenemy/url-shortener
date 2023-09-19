import { ObjectId } from 'mongodb';
import { getUrlCollection } from '../../src/db';
import { checkOriginalUrlExists, getUrl, insertUrl } from '../../src/models/url.db';

beforeEach(async () => {
  // Clear URL Collection before each test.
  await getUrlCollection().deleteMany();
});

const MOCK_ORIGINAL_URL = 'mock-original-url';
const MOCK_SHORT_URL = 'mock-short-url';
const MOCK_USER_ID = new ObjectId();

describe('Test insertUrl()', () => {
  it('should successfully insert a URL', async () => {
    await insertUrl({
      shortenedUrl: MOCK_SHORT_URL,
      originalUrl: MOCK_ORIGINAL_URL,
      userId: MOCK_USER_ID,
    });
    const url = await getUrl(MOCK_SHORT_URL);
    expect(url.originalUrl).toBe(MOCK_ORIGINAL_URL);
  });
});

describe('Test getOriginalUrlExists', () => {
  it('should return false for URL that does not exist', async () => {
    const urlExists = await checkOriginalUrlExists(MOCK_ORIGINAL_URL, MOCK_USER_ID);
    expect(urlExists).toBe(false);
  });

  it('should return true for URL that exist', async () => {
    await insertUrl({
      shortenedUrl: MOCK_SHORT_URL,
      originalUrl: MOCK_ORIGINAL_URL,
      userId: MOCK_USER_ID,
    });
    const urlExists = await checkOriginalUrlExists(MOCK_ORIGINAL_URL, MOCK_USER_ID);
    expect(urlExists).toBe(true);
  });
});
