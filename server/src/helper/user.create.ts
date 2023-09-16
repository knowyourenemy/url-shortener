import { IUser, SESSION_DURATION, checkUsernameExists, insertUser } from '../models/user.db';
import { AppError, BadRequestError, HelperError } from '../util/appError';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Create a new user
 * @param userData - User document.
 * @returns {string} Session ID of newly created user.
 */
export const createUser = async (userData: Pick<IUser, 'username' | 'password'>): Promise<string> => {
  try {
    const userExists = await checkUsernameExists(userData.username);
    if (userExists) {
      throw new BadRequestError('User already exists.');
    }
    const sessionId = uuidv4();
    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
    const newUser: IUser = {
      username: userData.username,
      password: hashedPassword,
      sessions: [
        {
          sessionId: sessionId,
          expiry: Date.now() + SESSION_DURATION,
        },
      ],
    };
    await insertUser(newUser);
    return sessionId;
  } catch (e: any) {
    if (e instanceof AppError) {
      throw e;
    }
    throw new HelperError(e.message);
  }
};
