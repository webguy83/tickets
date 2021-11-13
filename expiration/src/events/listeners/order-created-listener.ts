import { Listener, OrderCreatedEvent, Subjects } from '@goofytickets/common';
import { Message } from 'node-nats-streaming';
import { QueueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = QueueGroupName.ExpirationService;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {}
}
