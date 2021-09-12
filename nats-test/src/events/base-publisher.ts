import { Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];
  private client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  publish(data: T['data']): Promise<void> {
    return new Promise((res, rej) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          return rej(err);
        }
        console.log(`Event sent from ${this.subject}!`);
        res();
      });
    });
  }
}
