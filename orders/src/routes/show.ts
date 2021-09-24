import { NotAuthError, NotFoundError, requireAuth } from '@goofytickets/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/order';

const showOrderRouter = express.Router();

showOrderRouter.get(
  '/api/orders/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthError();
    }
    res.send(order);
  }
);

export { showOrderRouter };
