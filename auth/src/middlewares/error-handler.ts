import { Request, Response, NextFunction } from 'express';
import { RequestValidationError } from '../errors/req-validation-error';
import { DbValidationError } from '../errors/db-validation-error';

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
  if (err instanceof RequestValidationError) {
    const errors: IResponseStructure[] = err.errors.map((err) => {
      return {
        message: err.msg,
        field: err.param,
      };
    });
    return res.status(400).send({ errors });
  }

  if (err instanceof DbValidationError) {
    return res.status(500).send({ errors: [{ message: err.reason }] });
  }

  res.status(400).send({
    message: err.message,
  });
};
