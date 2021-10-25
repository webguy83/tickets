import { TicketUpdatedEvent } from '@goofytickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { getObjectId } from '../../../test/utils';
import { TicketUpdatedListener } from '../ticket-updated-listener';

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: getObjectId,
    title: 'hothorse',
    price: 69,
  });

  await ticket.save();

  const data: TicketUpdatedEvent['data'] = {
    version: ticket.version + 1,
    id: ticket.id,
    title: 'hothorse-sexy',
    price: 6969,
    userId: getObjectId,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it('updates and saves a ticket', async () => {
  const { listener, data, msg, ticket } = await setup();

  await listener.onMessage(data, msg);

  const modifiedTicket = await Ticket.findById(ticket.id);
  expect(modifiedTicket).toBeDefined();
  expect(modifiedTicket?.title).toEqual(data.title);
  expect(modifiedTicket?.price).toEqual(data.price);
  expect(modifiedTicket?.version).toEqual(data.version);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event is in the future too far', async () => {
  const { listener, msg, data } = await setup();

  data.version = 69;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
