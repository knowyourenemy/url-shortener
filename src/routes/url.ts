import express, { Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/authenticate';
import { AppError, RouteError } from '../util/appError';
import { createUser } from '../helper/user.create';
import { loginUser } from '../helper/user.login';
import { createUrl } from '../helper/url.create';
import { deleteUrl, getAllUserUrls, getUrl } from '../models/url.db';
import { authorize } from '../middleware/authorize';

const router = express.Router();

router
  /**
   * Get original URL from shortened URL.
   * Does not require authentication.
   */
  .get('/:shortenedUrl', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const url = await getUrl(req.params.shortenedUrl);
      return res.redirect(url.originalUrl);
    } catch (e: any) {
      if (e instanceof AppError) {
        next(e);
      } else {
        next(new RouteError(e.message));
      }
    }
  })
  /**
   * Delete shortened URL.
   * Requires user to be authenticated.
   */
  .delete('/:shortenedUrl', authenticate, authorize, async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteUrl(req.params.shortenedUrl);
      return res.sendStatus(200);
    } catch (e: any) {
      if (e instanceof AppError) {
        next(e);
      } else {
        next(new RouteError(e.message));
      }
    }
  });

router
  /**
   * Create new URL.
   * Requires user to be authenticated.
   */
  .post('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shortenedUrl = await createUrl(req.body.originalUrl, req.user!._id);
      return res.status(200).send({ shortenedUrl: shortenedUrl });
    } catch (e: any) {
      if (e instanceof AppError) {
        next(e);
      } else {
        next(new RouteError(e.message));
      }
    }
  })
  /**
   * Get all user URLS.
   * Requires user to be authenticated.
   */
  .get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const urls = await getAllUserUrls(req.user!._id);
      return res.status(200).send({ urls: urls });
    } catch (e: any) {
      if (e instanceof AppError) {
        next(e);
      } else {
        next(new RouteError(e.message));
      }
    }
  });

export default router;