import { Request, Response, NextFunction } from 'express';
import { NotAuthError } from '../errors/not-auth-error';

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.currentUser);
  if (!req.currentUser) {
    throw new NotAuthError();
  }

  next();
};
