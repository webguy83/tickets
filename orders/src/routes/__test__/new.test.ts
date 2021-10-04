import request from 'supertest';
import { getAuthCookie, getObjectId } from '../../test/utils';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to orders', async () => {
  const res = await request(app).post('/api/orders').send({});
  expect(res.status).not.toEqual(404);
});

it('should show a status 401 if user not signed in', async () => {
  await request(app).post('/api/orders').send({}).expect(401);
});

it('should not show 401 if the user is signed in', async () => {
  const res = await request(app)
    .post('/api/orders')
    .set('Cookie', getAuthCookie())
    .send({});
  expect(res.status).not.toEqual(401);
});

it('should throw a 400 if ticketId is invalid', async () => {
  await request(app)
    .post('/api/orders')
    .set('Cookie', getAuthCookie())
    .send({ ticketId: 3244 })
    .expect(400);
  await request(app)
    .post('/api/orders')
    .set('Cookie', getAuthCookie())
    .send({})
    .expect(400);
});

it('should throw a 404 if ticket does not exist', async () => {
  await request(app)
    .post('/api/orders')
    .set('Cookie', getAuthCookie())
    .send({ ticketId: getObjectId })
    .expect(404);
});

it('should throw a 400 if the ticket is reserved', async () => {
  const ticket = Ticket.build({
    title: 'Oger',
    price: 69,
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', getAuthCookie())
    .send({ ticketId: ticket.id });

  await request(app)
    .post('/api/orders')
    .set('Cookie', getAuthCookie())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserves a ticket', async () => {
  let orders = await Order.find({});
  expect(orders.length).toEqual(0);

  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const ticketTitle = 'Oger';
  const ticketPrice = 69;

  const ticket = Ticket.build({
    title: ticketTitle,
    price: ticketPrice,
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', getAuthCookie())
    .send({ ticketId: ticket.id })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(ticketTitle);
  expect(tickets[0].price).toEqual(ticketPrice);

  orders = await Order.find({});
  expect(orders.length).toEqual(1);
  expect(orders[0].status).toEqual(OrderStatus.Created);
  expect(JSON.stringify(orders[0].ticket)).toEqual(JSON.stringify(ticket.id));
});

it('emits an order created event', async () => {
  const ticketTitle = 'Oger';
  const ticketPrice = 69;

  const ticket = Ticket.build({
    title: ticketTitle,
    price: ticketPrice,
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', getAuthCookie())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
