import nats from 'node-nats-streaming';

console.clear();

const client = nats.connect('tickets', 'noobs', {
  url: 'http://localhost:4222',
});

client.on('connect', () => {
  console.log('Publisher connected to NATS');

  const data = JSON.stringify({
    id: '349875',
    title: 'nooooooobs',
    price: 69,
  });

  client.publish('ticket:created', data, () => {
    console.log('Event published!');
  });
});
