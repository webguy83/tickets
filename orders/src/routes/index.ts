import { currentUser, requireAuth } from '@goofytickets/common';
import express, { Request, Response } from 'express';

const indexOrdersRouter = express.Router();

indexOrdersRouter.get(
  '/api/orders',
  currentUser,
  requireAuth,
  (req: Request, res: Response) => {
    res.send({});
  }
);

export { indexOrdersRouter };
