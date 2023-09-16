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
  const user = await findUser(username, password);
  await deleteExpiredUserSessions(user.userId);
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
  await addUserSession(user.userId, session);
  return sessionId;
};
