import {
  OrderCreatedEvent,
  OrderStatus,
  TicketCreatedEvent,
} from '@goofytickets/common';
import { Types } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCreatedListener } from '../events/listeners/order-created-listener';
import { Order } from '../models/order';
import { natsWrapper } from '../nats-wrapper';
import { getObjectId } from '../test/utils';

const setup = () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent['data'] = {
    id: getObjectId,
    status: OrderStatus.Created,
    version: 0,
    userId: 'dsfdsfds',
    expiresAt: 'Jan 1',
    ticket: {
      id: Types.ObjectId().toHexString(),
      price: 69,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, msg, data };
};

it('creates and saves an order to db', async () => {
  const { listener, msg, data } = setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);
  expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
  const { listener, msg, data } = setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
