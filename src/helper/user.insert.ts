import { IUser, SESSION_DURATION, checkUsernameExists, insertUser } from '../models/user.db';
import { BadRequestError } from '../util/appError';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create a new user
 * @param userData - User document.
 * @returns {string} Session ID of newly created user.
 */
export const createUser = async (userData: Pick<IUser, 'username' | 'password'>): Promise<string> => {
  const userExists = await checkUsernameExists(userData.username);
  if (userExists) {
    throw new BadRequestError('User already exists.');
  }
  const userId = uuidv4();
  const sessionId = uuidv4();
  const newUser: IUser = {
    userId: userId,
    username: userData.username,
    password: userData.password,
    sessions: [
      {
        sessionId: sessionId,
        expiry: Date.now() + SESSION_DURATION,
      },
    ],
  };
  await insertUser(newUser);
  return sessionId;
};
