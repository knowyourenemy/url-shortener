import { getUserCollection } from '../db';
import { AppError, DbError, NotFoundError } from '../util/appError';

// Duration (in ms) to keep session alive.
export const SESSION_DURATION = 5 * 60 * 1000;

export interface ISession {
  sessionId: string;
  expiry: number;
}

export interface IUser {
  userId: string;
  username: string;
  password: string;
  sessions: ISession[];
}
/**
 * Insert new user into DB.
 * @param userData - User document.
 */
export const insertUser = async (userData: IUser): Promise<void> => {
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

/**
 * Check if a user with the given username already exists.
 * @param username - Username.
 * @returns {boolean} - True if user already exists, and false otherwise.
 */
export const checkUsernameExists = async (username: string): Promise<boolean> => {
  try {
    const userCollection = getUserCollection();
    const user = await userCollection.findOne({
      username: username,
    });
    if (user) {
      return true;
    }
    return false;
  } catch (e: any) {
    if (e instanceof AppError) {
      throw e;
    } else {
      throw new DbError(e.message);
    }
  }
};

/**
 * Find user with given username and password.
 * @param username - Username.
 * @param password - Password
 * @returns {IUser} - User document.
 */
export const findUser = async (username: string, password: string): Promise<IUser> => {
  try {
    const userCollection = getUserCollection();
    const user = await userCollection.findOne({
      username: username,
      password: password,
    });
    if (!user) {
      throw new NotFoundError('User does not exist.');
    }
    return user;
  } catch (e: any) {
    if (e instanceof AppError) {
      throw e;
    } else {
      throw new DbError(e.message);
    }
  }
};

/**
 * Update user session expiry to last for SESSION_DURATION more time.
 * @param sessionId - sessionId of session to be refreshed.
 */
export const refreshUserSession = async (sessionId: string): Promise<void> => {
  try {
    const userCollection = getUserCollection();
    await userCollection.findOneAndUpdate(
      {
        'sessions.sessionId': sessionId,
      },
      {
        $set: {
          'sessions.$.expiry': Date.now() + SESSION_DURATION,
        },
      },
    );
  } catch (e: any) {
    if (e instanceof AppError) {
      throw e;
    } else {
      throw new DbError(e.message);
    }
  }
};

/**
 * Delete all expired sessions for user with given userId.
 * @param userId userId of user to delete expired sessions for.
 */
export const deleteExpiredUserSessions = async (userId: string) => {
  try {
    const userCollection = getUserCollection();
    await userCollection.findOneAndUpdate(
      {
        userId: userId,
      },
      {
        $pull: {
          sessions: {
            expiry: {
              $lt: Date.now(),
            },
          },
        },
      },
    );
  } catch (e: any) {
    if (e instanceof AppError) {
      throw e;
    } else {
      throw new DbError(e.message);
    }
  }
};

/**
 * Add given session to user with given userId.
 * @param userId - userId of user to update.
 * @param session - session document.
 */
export const addUserSession = async (userId: string, session: ISession) => {
  try {
    const userCollection = getUserCollection();
    await userCollection.findOneAndUpdate(
      {
        userId: userId,
      },
      {
        $push: {
          sessions: session,
        },
      },
    );
  } catch (e: any) {
    if (e instanceof AppError) {
      throw e;
    } else {
      throw new DbError(e.message);
    }
  }
};
