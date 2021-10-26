import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { getAuthCookie, getObjectId } from '../../test/utils';

it('should throw a 401 if the user is not auth', async () => {
  await request(app).get('/api/orders/fdgdsfg').send({}).expect(401);
});

it('should create an order', async () => {
  const ticket = Ticket.build({
    id: getObjectId,
    title: 'noooob',
    price: 69,
  });

  await ticket.save();

  const userCookie = getAuthCookie();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', userCookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', userCookie)
    .send()
    .expect(200);

  expect(order.id).toEqual(fetchedOrder.id);
  //await request(app).get('/api/orders/:id').set('Cookie', userCookie);
});

it('should throw a 404 if order not found', async () => {
  await request(app)
    .get(`/api/orders/${getObjectId}`)
    .set('Cookie', getAuthCookie())
    .send()
    .expect(404);
});

it('should throw a 401 if user not authorized', async () => {
  const ticket = Ticket.build({
    id: getObjectId,
    title: 'noooob',
    price: 69,
  });
  await ticket.save();

  const userCookie = getAuthCookie();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', userCookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', getAuthCookie())
    .send()
    .expect(401);
});
