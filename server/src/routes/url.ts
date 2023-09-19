import express, { Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/authenticate';
import { AppError, BadRequestError, RouteError } from '../util/appError';
import { createUrl } from '../helper/url.create';
import { deleteUrl, getAllUserUrls, getUrl } from '../models/url.db';
import { authorize } from '../middleware/authorize';

const router = express.Router();

router
  /**
   * GET /api/url/:shortenedUrl
   * @param {string} shortenedUrl - Shortened URL.
   * Get original URL from shortened URL. Returns a 301 redirect.
   * Does not require authentication.
   */
  .get('/:shortenedUrl', async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.params.shortenedUrl) {
        throw new BadRequestError('Incomplete information to process request.');
      }
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
   * DELETE /api/url/:shortenedUrl
   * @param {string} shortenedUrl - Shortened URL to be deleted.
   * Delete shortened URL.
   * Requires user to be authenticated.
   */
  .delete('/:shortenedUrl', authenticate, authorize, async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.params.shortenedUrl) {
        throw new BadRequestError('Incomplete information to process request.');
      }
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
   * POST /api/url
   * @param {string} originalUrl - Original URL to be shortened.
   * @returns {{shortenedUrl: string}} - Shortened url.
   * Create new URL.
   * Requires user to be authenticated.
   */
  .post('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body.originalUrl) {
        throw new BadRequestError('Incomplete information to process request.');
      }
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
   * GET /api/url
   * @returns {IUrlWithDate[]} User URLs.
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
