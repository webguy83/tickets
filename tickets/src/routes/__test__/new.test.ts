import request from 'supertest';
import { app } from '../../app';
import { getAuthCookie } from '../../test/utils';
import { Ticket } from '../../models/ticket';

it('has a route handler listening to api/tickets for post reqs', async () => {
  const res = await request(app).post('/api/tickets').send({});

  expect(res.status).not.toEqual(404);
});
it('has to be accessed if the user is signed in', async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
});
it('if user is signed in then send other status than 401', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', getAuthCookie())
    .send({});

  expect(res.status).not.toEqual(401);
});
it('returns an error if the invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', getAuthCookie())
    .send({
      title: '',
      price: 54,
    })
    .expect(400);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', getAuthCookie())
    .send({
      price: 54,
    })
    .expect(400);
});
it('returns an error if the invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', getAuthCookie())
    .send({
      title: 'bunk',
      price: -44,
    })
    .expect(400);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', getAuthCookie())
    .send({
      title: 'oger',
    })
    .expect(400);
});
it('creates a ticket with valid params/inputs', async () => {
  // make sure ticket is saved in db
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const title = 'noob';
  const price = 99;

  await request(app)
    .post('/api/tickets')
    .set('Cookie', getAuthCookie())
    .send({
      title,
      price,
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(title);
  expect(tickets[0].price).toEqual(price);
});
