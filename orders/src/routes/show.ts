import { currentUser, requireAuth } from '@goofytickets/common';
import express, { Request, Response } from 'express';

const showOrderRouter = express.Router();

showOrderRouter.get(
  '/api/orders/:id',
  currentUser,
  requireAuth,
  (req: Request, res: Response) => {
    res.send({});
  }
);

export { showOrderRouter };
