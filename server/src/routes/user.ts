import express, { Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/authenticate';
import { AppError, BadRequestError, RouteError } from '../util/appError';
import { createUser } from '../helper/user.create';
import { loginUser } from '../helper/user.login';
import { deleteUserSession } from '../models/user.db';

const router = express.Router();

/**
 * Route to log-in existing user.
 */
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body.username || !req.body.password) {
      throw new BadRequestError('Incomplete information to process request.');
    }
    const sessionId = await loginUser(req.body.username, req.body.password, req.cookies['sessionId']);
    return res
      .cookie('sessionId', sessionId, {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
      })
      .sendStatus(200);
  } catch (e: any) {
    if (e instanceof AppError) {
      next(e);
    } else {
      next(new RouteError(e.message));
    }
  }
});

/**
 * Route to log-out existing user.
 */
router.post('/logout', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.cookies['sessionId']) {
      throw new BadRequestError('Incomplete information to process request.');
    }
    await deleteUserSession(req.user!._id, req.cookies['sessionId']);
    return res.clearCookie('sessionId').sendStatus(200);
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
   * Route to create new user.
   */
  .post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body.username || !req.body.password) {
        throw new BadRequestError('Incomplete information to process request.');
      }
      const sessionId = await createUser({
        username: req.body.username,
        password: req.body.password,
      });
      return res
        .cookie('sessionId', sessionId, {
          secure: true,
          httpOnly: true,
          sameSite: 'none',
        })
        .sendStatus(200);
    } catch (e: any) {
      if (e instanceof AppError) {
        next(e);
      } else {
        next(new RouteError(e.message));
      }
    }
  })
  /**
   * Get username from Session ID.
   */
  .get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).send({ username: req.user!.username });
    } catch (e: any) {
      if (e instanceof AppError) {
        next(e);
      } else {
        next(new RouteError(e.message));
      }
    }
  });

export default router;
