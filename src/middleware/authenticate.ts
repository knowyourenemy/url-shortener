import { Request, Response, NextFunction } from 'express';
import { AppError, DbError, UnauthorizedError } from '../util/appError';
import { checkValidSession, findUserBySession, refreshUserSession } from '../models/user.db';

/**
 * Middleware function to ensure user is authenticated.
 * Refreshes user session if user is authenticated, and throws a
 * 401 Unauthorized error otherwise.
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = req.cookies['sessionId'];
    const isValid = await checkValidSession(sessionId);
    if (!isValid) {
      throw new UnauthorizedError('Invalid session ID');
    }
    const user = await findUserBySession(sessionId);
    await refreshUserSession(sessionId);
    req.user = user.userId;
    next();
  } catch (e: any) {
    if (e instanceof AppError) {
      next(e);
    } else {
      next(new DbError(e.message));
    }
  }
};
