import express, { Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/authenticate';
import { AppError, RouteError } from '../util/appError';
import { createUser } from '../helper/user.insert';
import { loginUser } from '../helper/user.login';

const router = express.Router();

/**
 * Route to create new user.
 */
router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = await createUser({
      username: req.body.username,
      password: req.body.password,
    });
    return res
      .cookie('sessionId', sessionId, {
        secure: true,
        httpOnly: true,
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
 * Route to log-in existing user.
 */
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = await loginUser(req.body.username, req.body.password, req.cookies['sessionId']);
    return res
      .cookie('sessionId', sessionId, {
        secure: true,
        httpOnly: true,
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

export default router;
