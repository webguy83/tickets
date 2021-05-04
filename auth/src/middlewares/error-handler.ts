import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';

interface IResponseStructure {
  message: string;
  field?: string;
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    const errors: IResponseStructure[] = err.serializeErrors();
    return res.status(err.statusCode).send({ errors });
  }

  res.status(400).send({
    message: err.message,
  });
};
