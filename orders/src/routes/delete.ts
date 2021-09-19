import express, { Request, Response } from 'express';

const deleteOrderRouter = express.Router();

deleteOrderRouter.delete('/api/orders/:id', (req: Request, res: Response) => {
  res.send({});
});

export { deleteOrderRouter };
