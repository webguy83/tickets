import { Listener, Subjects, TicketUpdatedEvent } from '@goofytickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { QueueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  questGroupName = QueueGroupName.OrdersService;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findByIdwithVersion(data);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
