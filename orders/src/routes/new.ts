import {
  BadReqError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@goofytickets/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';

const createOrderRouter = express.Router();

createOrderRouter.post(
  '/api/orders/',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Ticket ID required!'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    const existingOrder = await Order.findOne({
      ticket,
      status: {
        $nin: [OrderStatus.Cancelled],
      },
    });

    if (existingOrder) {
      throw new BadReqError('Ticket is reserved already!');
    }
    res.send({});
  }
);

export { createOrderRouter };
