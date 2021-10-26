import request from 'supertest';
import { getAuthCookie } from '../../test/utils';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Types } from 'mongoose';

it('has a route handler listening for orders', async () => {
  const res = await request(app).get('/api/orders').send({});
  expect(res.status).not.toEqual(404);
});

it('will throw a 401 if not authenticated', async () => {
  const res = await request(app).get('/api/orders').send({});
  expect(res.status).toEqual(401);
});

const makeTicket = async () => {
  const ticket = Ticket.build({
    id: Types.ObjectId().toHexString(),
    title: 'roodypoo',
    price: 69,
  });

  await ticket.save();

  return ticket;
};

it('fetches orders for the specific person', async () => {
  const ticketOne = await makeTicket();
  const ticketTwo = await makeTicket();
  const ticketThree = await makeTicket();

  const userOne = getAuthCookie();
  const userTwo = getAuthCookie();

  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);
  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  const res = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200);

  expect(res.body.length).toEqual(2);
  expect(res.body[0].id).toEqual(orderOne.id);
  expect(res.body[1].id).toEqual(orderTwo.id);
  expect(res.body[0].ticket.id).toEqual(ticketTwo.id);
  expect(res.body[1].ticket.id).toEqual(ticketThree.id);
});
