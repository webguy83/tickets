import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';
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

it('returns a 401 if the user does not own the ticket', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', getAuthCookie())
    .send({
      title: 'knockers',
      price: 453,
    });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', getAuthCookie())
    .send({
      title: 'dsfsfsdfdsf',
      price: 45,
    })
    .expect(401);

  expect(res.body.title).toEqual('knockers');
  expect(res.body.price).toEqual(453);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = getAuthCookie();

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'knockers',
      price: 453,
    });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 455,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'noobs',
      price: -69,
    })
    .expect(400);
});

it('returns a 200 if the user provides valid data', async () => {
  const cookie = getAuthCookie();

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'knockers',
      price: 453,
    });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'get rekt lol',
      price: 69,
    })
    .expect(200);

  const updatedRes = await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .send();

  expect(updatedRes.body.title).toEqual('get rekt lol');
  expect(updatedRes.body.price).toEqual(69);
});

it('updates an event', async () => {
  const cookie = getAuthCookie();

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'knockers',
      price: 453,
    });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'get rekt lol',
      price: 69,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the ticket is reserved', async () => {
  const cookie = getAuthCookie();

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'knockers',
      price: 453,
    });

  const ticket = await Ticket.findById(res.body.id);
  ticket?.set({
    orderId: getObjectId,
  });
  await ticket?.save();

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'get rekt lol',
      price: 69,
    })
    .expect(400);
});
