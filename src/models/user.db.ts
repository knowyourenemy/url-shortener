import { getUserCollection } from '../db';
import { AppError, DbError } from '../util/appError';

export interface ISession {
  sessionId: string;
  expiry: number;
}

export interface IUser {
  username: string;
  password: string;
  sessions: ISession[];
}
/**
 * Insert new user into DB.
 * @param userData - User document.
 */
export const createUser = async (userData: IUser): Promise<void> => {
  try {
    const userCollection = getUserCollection();
    const res = await userCollection.insertOne(userData);
    if (!res.acknowledged) {
      throw new DbError(`Could not insert user with username ${userData.username}.`);
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
 * Check if user session is valid.
 * @param sessionId - Session ID.
 * @returns {boolean} True if session is valid, and false otherwise.
 */
export const checkUserSession = async (sessionId: string): Promise<boolean> => {
  try {
    const userCollection = getUserCollection();
    const res = await userCollection.findOne({
      'sessions.sessionId': sessionId,
    });
    if (!res) {
      return false;
    }
    const session = res.sessions.find((session) => session.sessionId === sessionId);
    if (session!.expiry < Date.now()) {
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
