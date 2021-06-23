import request from 'supertest';
import { app } from '../app';

const getAuthCookie = async () => {
  const authRes = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'noob@noob.com',
      password: 'ackerdunce',
    })
    .expect(201);

  return authRes.get('Set-Cookie');
};

export { getAuthCookie };
