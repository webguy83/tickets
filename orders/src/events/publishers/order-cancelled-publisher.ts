import { OrderCreatedEvent, Publisher, Subjects } from '@goofytickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
