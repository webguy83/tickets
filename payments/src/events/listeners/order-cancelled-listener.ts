import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from '@goofytickets/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { QueueGroupName } from './queue-group-name';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = QueueGroupName.PaymentsService;
  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findByIdwithVersion(data);

    if (!order) {
      throw new Error('Order not found!');
    }

    order.set({
      status: OrderStatus.Cancelled,
    });
    await order.save();

    msg.ack();
  }
}
