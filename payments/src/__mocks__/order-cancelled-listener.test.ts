import { OrderCancelledEvent, OrderStatus, Subjects } from '@goofytickets/common';
import { OrderCancelledListener } from '../events/listeners/order-cancelled-listener';
import { Order } from '../models/order';
import { natsWrapper } from '../nats-wrapper';
import { getObjectId } from '../test/utils';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: getObjectId,
    version: 0,
    userId: 'dsfklsdjfds',
    price: 69,
    status: OrderStatus.Created,
  });

  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: 'fdgdfgdfg',
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('should cancel an order', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);
  expect(order!.status).toEqual(OrderStatus.Cancelled);
});

it('should ack a message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
