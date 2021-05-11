import express from 'express';
import { json } from 'body-parser';
import mongoose from 'mongoose';

import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';
import 'express-async-errors';
import cookieSession from 'cookie-session';

const app = express();
app.set('trust proxy', true);

app.use(json());

app.use(
  cookieSession({
    secure: true,
    signed: false,
  })
);

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const init = async () => {
  try {
    if (!process.env.JWT_KEY) {
      throw new Error('You need a JWT token!');
    }
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('hazaahh connected noob ha');
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log('Listening on the port 300 yayyy~ FUCKERRRRRR');
  });
};

init();
