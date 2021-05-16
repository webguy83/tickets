import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user';
import { Password } from '../services/password';
import { BadReqError } from '../errors/bad-req-error';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid!'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password!'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const newUser = await User.findOne({ email });

    if (!newUser) {
      throw new BadReqError('Invalid credds');
    }

    const passwordsMatch = await Password.compare(newUser.password, password);

    if (!passwordsMatch) {
      throw new BadReqError('Invalid credds');
    }

    // generate JWT
    const userJwt = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(newUser);
  }
);

export { router as signInRouter };
