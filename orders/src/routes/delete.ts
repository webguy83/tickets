import {
  NotAuthError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from '@goofytickets/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/order';

const deleteOrderRouter = express.Router();

deleteOrderRouter.patch(
  '/api/orders/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();
    res.status(200).send(order);
  }
);

export { deleteOrderRouter };
