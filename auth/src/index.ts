import mongoose from 'mongoose';
import { app } from './app';

const init = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('You need a JWT token!');
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('connected to mongo db woohoo');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on the port 300 yayyy~ woot');
  });
};

init();
