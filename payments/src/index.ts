import mongoose from 'mongoose';
import { app } from './app';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { natsWrapper } from './nats-wrapper';

const init = async () => {
  const { JWT_KEY, MONGO_URI, NATS_URL, NATS_CLUSTER_ID, NATS_CLIENT_ID } = process.env;
  if (!JWT_KEY) {
    throw new Error('You need a JWT token!');
  }

  if (!MONGO_URI) {
    throw new Error('MONGO_URI must be defined!');
  }

  if (!NATS_URL) {
    throw new Error('NATS_URL must be defined!');
  }

  if (!NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined!');
  }

  if (!NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined!');
  }

  try {
    await natsWrapper.connect(NATS_CLUSTER_ID, NATS_CLIENT_ID, NATS_URL);
    natsWrapper.client.on('close', () => {
      console.log('NATs connection has closed');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

    await mongoose.connect(MONGO_URI, {
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
