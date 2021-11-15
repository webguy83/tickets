import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { natsWrapper } from './nats-wrapper';

const init = async () => {
  const { NATS_URL, NATS_CLUSTER_ID, NATS_CLIENT_ID } = process.env;
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
  } catch (err) {
    console.error(err);
  }
};

init();
