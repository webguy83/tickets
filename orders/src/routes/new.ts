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
  '/api/orders',
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
    let seconds = '';

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadReqError('Ticket is reserved already!');
    }

    if (process.env.EXPIRATION_ORDER_SECONDS) {
      seconds = process.env.EXPIRATION_ORDER_SECONDS;
    }

    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + parseInt(seconds));

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt,
      ticket,
    });

    await order.save();

    res.status(201).send(order);
  }
);

export { createOrderRouter };
