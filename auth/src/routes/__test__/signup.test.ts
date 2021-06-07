import request from 'supertest';
import { app } from '../../app';

it('returns a 201 when signup!', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'bunk@crud.com',
      password: 'jlhdkdsfhdskflhs',
    })
    .expect(201);
});

it('returns a 400 with a buggered up email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'oger@dsfdsffds',
      password: 'ndsfdsf',
    })
    .expect(400);
});

it('returns a 400 with a buggered up password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'oger@dsfdsffds',
      password: '',
    })
    .expect(400);
});

it('returns a 400 with a buggered up email and password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: '',
      password: '',
    })
    .expect(400);
});

it('can sign up with the same email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'blah@crap.com',
      password: 'dfdff',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'blah@crap.com',
      password: 'dfdff',
    })
    .expect(400);
});

it('can set a cookie after successful signup', async () => {
  const res = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'blah@crap.com',
      password: 'dfdff',
    })
    .expect(201);

  expect(res.get('Set-Cookie')).toBeDefined();
});
