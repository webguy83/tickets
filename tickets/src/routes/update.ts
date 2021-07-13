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
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    res.send(ticket);
  }
);

export { updateTicketRouter };
