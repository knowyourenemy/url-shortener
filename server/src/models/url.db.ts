import { ObjectId, WithId } from 'mongodb';
import { getUrlCollection } from '../db';
import { AppError, DbError, NotFoundError } from '../util/appError';

export interface IUrl {
  userId: ObjectId;
  shortenedUrl: string;
  originalUrl: string;
}

/**
 * Insert new url into DB
 * @param urlData - Url document.
 */
export const insertUrl = async (urlData: IUrl): Promise<void> => {
  try {
    const urlCollection = getUrlCollection();
    const res = await urlCollection.insertOne(urlData);
    if (!res.acknowledged) {
      throw new DbError(`Could not insert url ${urlData.originalUrl} for user ${urlData.userId}.`);
    }
  } catch (e: any) {
    if (e instanceof AppError) {
      throw e;
    } else {
      throw new DbError(e.message);
    }
  }
};

/**
 * Check if URL with given originalUrl and userId already exists.
 * @param originalUrl - URL to check.
 * @param userId - Object ID of user.
 */
export const checkOriginalUrlExists = async (originalUrl: string, userId: ObjectId): Promise<boolean> => {
  try {
    const urlCollection = getUrlCollection();
    const res = await urlCollection.findOne({
      userId: userId,
      originalUrl: originalUrl,
    });
    if (!res) {
      return false;
    }
    return true;
  } catch (e: any) {
    if (e instanceof AppError) {
      throw e;
    } else {
      throw new DbError(e.message);
    }
  }
};

/**
 * Check if URL with given shortenedUrl already exists.
 * @param shortenedUrl - URL to check.
 */
export const checkShortenedUrlExists = async (shortenedUrl: string): Promise<boolean> => {
  try {
    const urlCollection = getUrlCollection();
    const res = await urlCollection.findOne({
      shortenedUrl: shortenedUrl,
    });
    if (!res) {
      return false;
    }
    return true;
  } catch (e: any) {
    if (e instanceof AppError) {
      throw e;
    } else {
      throw new DbError(e.message);
    }
  }
};

/**
 * Get URL for given shortened URL.
 * @param shortenedUrl - shortened URL.
 * @returns {WithId<IUrl>} URL document.
 */
export const getUrl = async (shortenedUrl: string): Promise<WithId<IUrl>> => {
  try {
    const urlCollection = getUrlCollection();
    const res = await urlCollection.findOne({
      shortenedUrl: shortenedUrl,
    });
    if (!res) {
      throw new NotFoundError('URL not found.');
    }
    return res;
  } catch (e: any) {
    if (e instanceof AppError) {
      throw e;
    } else {
      throw new DbError(e.message);
    }
  }
};

/**
 * Get all URLs for given user.
 * @param userId - Object Id of user.
 * @returns {WithId<IUrl>[]} Url documents of given user.
 */
export const getAllUserUrls = async (userId: ObjectId): Promise<WithId<IUrl>[]> => {
  try {
    const urlCollection = getUrlCollection();
    const res = await urlCollection.find({ userId: userId }).toArray();
    return res;
  } catch (e: any) {
    if (e instanceof AppError) {
      throw e;
    } else {
      throw new DbError(e.message);
    }
  }
};

/**
 * Delete URL with given Id.
 * @param shortenedUrl - Shortened URL of URL to delete.
 */
export const deleteUrl = async (shortenedUrl: string): Promise<void> => {
  try {
    const urlCollection = getUrlCollection();
    const res = await urlCollection.deleteOne({
      shortenedUrl: shortenedUrl,
    });
    if (!res.acknowledged) {
      throw new DbError(`Could not delete url with shorened URL ${shortenedUrl}.`);
    }
  } catch (e: any) {
    if (e instanceof AppError) {
      throw e;
    } else {
      throw new DbError(e.message);
    }
  }
};
