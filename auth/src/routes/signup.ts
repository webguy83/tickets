import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/req-validation-error';
import { DbValidationError } from '../errors/db-validation-error';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email needs to be valid!'),
    body('password')
      .trim()
      .isLength({ min: 5, max: 20 })
      .withMessage('Passwords needs to be between 5 and 20 characters!'),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    console.log('User created.');
    throw new DbValidationError();
    res.send({});
  }
);

export { router as signUpRouter };
