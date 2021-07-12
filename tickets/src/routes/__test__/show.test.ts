import request from 'supertest';
import { app } from '../../app';
import { getAuthCookie } from '../../test/utils';

it('returns a 404 if ticket cannot be found', async () => {
  await request(app).get('/api/tickets/rollingducklegfeature');
});

it('returns a ticket if the ticket can be found', async () => {
  const title = 'noobTitle';
  const price = 69;

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', getAuthCookie())
    .send({
      title,
      price,
    })
    .expect(201);

  const ticketRes = await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .send()
    .expect(200);

  expect(ticketRes.body.title).toEqual(title);
  expect(ticketRes.body.price).toEqual(price);
});
