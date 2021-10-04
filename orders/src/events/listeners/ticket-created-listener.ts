import { Listener, Subjects, TicketCreatedEvent } from '@goofytickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { QueueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  questGroupName = QueueGroupName.OrdersService;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { title, price, id } = data;

    const ticket = Ticket.build({
      id,
      title,
      price,
    });

    await ticket.save();

    msg.ack();
  }
}
