import { OrderStatus } from '@goofytickets/common';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';
import { getAuthCookie, getObjectId } from '../../test/utils';

it('should throw a 401 if the user is not auth', async () => {
  await request(app).patch('/api/orders/sdfsdffsd').send({}).expect(401);
});

it('should update an order successfully', async () => {
  const ticket = Ticket.build({
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
    .patch(`/api/orders/${order.id}`)
    .set('Cookie', userCookie)
    .send()
    .expect(200);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.userId).toEqual(order.userId);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('should throw a 404 if order not found', async () => {
  await request(app)
    .patch(`/api/orders/${getObjectId}`)
    .set('Cookie', getAuthCookie())
    .send()
    .expect(404);
});

it('should throw a 401 if user not authorized', async () => {
  const ticket = Ticket.build({
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
    .patch(`/api/orders/${order.id}`)
    .set('Cookie', getAuthCookie())
    .send()
    .expect(401);
});

it('should update an order to cancelled', async () => {
  const ticket = Ticket.build({
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
    .patch(`/api/orders/${order.id}`)
    .set('Cookie', userCookie)
    .send()
    .expect(200);
});

it('emits an ordered cancelled event', async () => {
  const ticket = Ticket.build({
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
    .patch(`/api/orders/${order.id}`)
    .set('Cookie', userCookie)
    .send()
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
