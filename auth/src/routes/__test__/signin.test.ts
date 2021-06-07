import request from 'supertest';
import { app } from '../../app';

it('must be able to signin if email exists in db', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'dunk@dink.com',
      password: 'rollingduckleg',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'dunk@dink.com',
      password: 'rollingduckleg',
    })
    .expect(200);
});

it('must reject the user if they do not exist in the db', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'dunk@dink.com',
      password: 'rollingduckleg',
    })
    .expect(400);
});

it('should deny the user if the passwords do not match', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'dunk@dink.com',
      password: 'rollingduckleg',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'dunk@dink.com',
      password: 'noobed',
    })
    .expect(400);
});

it('can set a cookie after successful signin', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'blah@crap.com',
      password: 'dfdff',
    })
    .expect(201);

  const res = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'blah@crap.com',
      password: 'dfdff',
    })
    .expect(200);

  expect(res.get('Set-Cookie')).toBeDefined();
});
