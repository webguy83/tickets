import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthError,
} from '@goofytickets/common';
import { Ticket } from '../models/ticket';

const updateTicketRouter = express.Router();

updateTicketRouter.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required!'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be provided and more than 0!'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthError();
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });

    await ticket.save();

    res.send(ticket);
  }
);

export { updateTicketRouter };
