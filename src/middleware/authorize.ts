import { Request, Response, NextFunction } from 'express';
import { AppError, ForbiddenError } from '../util/appError';
import { getUrl } from '../models/url.db';

/**
 * Middleware function to ensure that the URL being accessed belongs to the user.
 * Throws a 403 Forbidden error otherwise.
 */
export const authorize = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shortenedUrl = req.params.shortenedUrl;
    const url = await getUrl(shortenedUrl);
    if (!url.userId.equals(req.user?._id)) {
      throw new ForbiddenError('User does not have access to this resource.');
    }
    next();
  } catch (e: any) {
    if (e instanceof AppError) {
      next(e);
    } else {
      next(new ForbiddenError(e.message));
    }
  }
};
