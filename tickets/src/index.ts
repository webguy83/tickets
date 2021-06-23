import mongoose from 'mongoose';
import { app } from './app';

const init = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('You need a JWT token!');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined!');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
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
