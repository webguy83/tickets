import { NotFoundError } from '@goofytickets/common';
import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';

const showTicketRouter = express.Router();

showTicketRouter.get(
  '/api/tickets/:id',
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    res.send(ticket);
  }
);

export { showTicketRouter };
