import { ObjectId } from 'mongodb';
import { IUrl, checkOriginalUrlExists, checkShortenedUrlExists, insertUrl } from '../models/url.db';
import { AppError, BadRequestError, HelperError } from '../util/appError';

// a-zA-Z0-9
// Excludes 'l', 'L', 'o', 'O', '0', '1' to make URL easier to read.
// This is because some of these characters (e.g. l, 1) are easily confused with each other.
const AVAILABLE_CHARS = 'abcdefghijkmnpqrstuvwxyzABCDEFGHIJKMNPQRSTUVWXYZ23456789';
const ENCODE_LENGTH = 5;

/**
 * generate random string of length ENCODE_LENGTH from characters in AVAILABLE_CHARS.
 * @returns {string} random string.
 */
const generateRandomString = (): string => {
  try {
    let encodedUrl = '';
    while (encodedUrl.length < ENCODE_LENGTH) {
      encodedUrl += AVAILABLE_CHARS.charAt(Math.floor(Math.random() * AVAILABLE_CHARS.length));
    }
    return encodedUrl;
  } catch (e: any) {
    if (e instanceof AppError) {
      throw e;
    }
    throw new HelperError(e.message);
  }
};

/**
 * Create a new URL.
 * @param originalUrl - Original URL to be shortened.
 * @param userId - Object ID of user.
 * @returns {string} shortened URL.
 */
export const createUrl = async (originalUrl: string, userId: ObjectId): Promise<string> => {
  try {
    const urlExists = await checkOriginalUrlExists(originalUrl, userId);
    if (urlExists) {
      throw new BadRequestError('URL already exists.');
    }
    let shortenedUrl = generateRandomString();
    let shortenedUrlExists = await checkShortenedUrlExists(shortenedUrl);
    while (shortenedUrlExists) {
      shortenedUrl = generateRandomString();
      shortenedUrlExists = await checkShortenedUrlExists(shortenedUrl);
    }
    const urlData: IUrl = {
      userId: userId,
      originalUrl: originalUrl,
      shortenedUrl: shortenedUrl,
    };
    await insertUrl(urlData);
    return shortenedUrl;
  } catch (e: any) {
    if (e instanceof AppError) {
      throw e;
    }
    throw new HelperError(e.message);
  }
};
