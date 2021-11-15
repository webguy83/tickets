import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@goofytickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
