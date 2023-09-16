import { ObjectId } from 'mongodb';
import { IUrl, checkOriginalUrlExists, insertUrl } from '../models/url.db';
import { AppError, BadRequestError, HelperError } from '../util/appError';

const AVAILABLE_CHARS = 'abcdefghijkmnpqrstuvwxyzABCDEFGHIJKMNPQRSTUVWXYZ123456789';
const ENCODE_LENGTH = 7;

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
    const shortenedUrl = generateRandomString();
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
