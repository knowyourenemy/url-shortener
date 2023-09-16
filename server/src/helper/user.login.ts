import {
  ISession,
  SESSION_DURATION,
  addUserSession,
  deleteExpiredUserSessions,
  findUser,
  refreshUserSession,
  checkValidSession,
} from '../models/user.db';
import { v4 as uuidv4 } from 'uuid';
import { AppError, HelperError, NotFoundError } from '../util/appError';
import bcrypt from 'bcrypt';

/**
 * Log-in user with given username and password.
 * @param username - username of user.
 * @param password - password of user.
 * @param existingSessionId - Existing session ID from cookies (if any).
 * @returns {string} Session ID of user session.
 */
export const loginUser = async (
  username: string,
  password: string,
  existingSessionId: string | undefined,
): Promise<string> => {
  try {
    const user = await findUser(username);
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new NotFoundError('User not found.');
    }
    await deleteExpiredUserSessions(user._id);
    if (existingSessionId) {
      const isValid = await checkValidSession(existingSessionId);
      if (isValid) {
        await refreshUserSession(existingSessionId);
        return existingSessionId;
      }
    }
    const sessionId = uuidv4();
    const session: ISession = {
      sessionId: sessionId,
      expiry: Date.now() + SESSION_DURATION,
    };
    await addUserSession(user._id, session);
    return sessionId;
  } catch (e: any) {
    if (e instanceof AppError) {
      throw e;
    }
    throw new HelperError(e.message);
  }
};
