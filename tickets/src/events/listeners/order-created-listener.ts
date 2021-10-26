import { Listener, OrderCreatedEvent, Subjects } from '@goofytickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { QueueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  questGroupName = QueueGroupName.TicketsService;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error('Ticket not found!');
    }

    ticket.set({
      orderId: data.id,
    });

    await ticket.save();

    msg.ack();
  }
}
