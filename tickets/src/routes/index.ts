import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';

const indexTickerRouter = express.Router();

indexTickerRouter.get('/api/tickets', async (req: Request, res: Response) => {
  const tickets = await Ticket.find({});

  res.send(tickets);
});

export { indexTickerRouter };
