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
 * Get original URL for given shortened URL.
 * @param shortenedUrl - shortened URL.
 * @returns {boolean} Original URL.
 */
export const getOriginalUrl = async (shortenedUrl: string): Promise<string> => {
  try {
    const urlCollection = getUrlCollection();
    const res = await urlCollection.findOne({
      shortenedUrl: shortenedUrl,
    });
    if (!res) {
      throw new NotFoundError('URL cannot be found.');
    }
    return res.originalUrl;
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
    const res = await urlCollection.find({ _id: userId }).toArray();
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
 * @param urlId - Object ID of URL to delete.
 */
export const deleteUrl = async (urlId: ObjectId): Promise<void> => {
  try {
    const urlCollection = getUrlCollection();
    const res = await urlCollection.deleteOne({
      _id: urlId,
    });
    if (!res.acknowledged) {
      throw new DbError(`Could not delete url with ID ${urlId}.`);
    }
  } catch (e: any) {
    if (e instanceof AppError) {
      throw e;
    } else {
      throw new DbError(e.message);
    }
  }
};
