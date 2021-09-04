import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

const client = nats.connect('tickets', 'noobs', {
  url: 'http://localhost:4222',
});

client.on('connect', async () => {
  console.log('Publisher connected to NATS');

  const data = {
    id: '349875',
    title: 'nooooooobs',
    price: 69,
  };
  try {
    await new TicketCreatedPublisher(client).publish(data);
  } catch (err) {
    console.error(err);
  }
});
