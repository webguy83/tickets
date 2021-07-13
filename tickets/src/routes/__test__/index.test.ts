import request from 'supertest';
import { app } from '../../app';
import { getAuthCookie } from '../../test/utils';

const generateTicket = () => {
  return request(app).post('/api/tickets').set('Cookie', getAuthCookie()).send({
    title: 'roodypoo',
    price: 45,
  });
};

it('can fetch all the tickets', async () => {
  await generateTicket();
  await generateTicket();
  await generateTicket();
  await generateTicket();
  await generateTicket();

  const res = await request(app).get('/api/tickets').send().expect(200);

  expect(res.body.length).toEqual(5);
});
