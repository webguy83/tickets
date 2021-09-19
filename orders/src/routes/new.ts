import { requireAuth, validateRequest } from '@goofytickets/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';

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
  (req: Request, res: Response) => {
    res.send({});
  }
);

export { createOrderRouter };
