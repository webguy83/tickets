import request from 'supertest';
import { app } from '../../app';
import { getObjectId, getAuthCookie } from '../../test/utils';

it('returns a 404 if the id does not exist', async () => {
  await request(app)
    .put(`/api/tickets/${getObjectId}`)
    .set('Cookie', getAuthCookie())
    .send({
      title: 'nubs',
      price: 4532,
    })
    .expect(404);
});

it('returns a 401 if the user not authenticated', async () => {
  await request(app)
    .put(`/api/tickets/${getObjectId}`)
    .send({
      title: 'nubs',
      price: 4532,
    })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {});

it('returns a 400 if the user provides an invalid title or price', async () => {});

it('returns a 200 if the user provides valid data', async () => {});
