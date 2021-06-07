import request from 'supertest';
import { app } from '../../app';
import { getAuthCookie } from '../../test/utils';

it('should show the current user ', async () => {
  const cookie = await getAuthCookie();

  const res = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);
  expect(res.body.currentUser.email).toEqual('noob@noob.com');
});

it('should not show the current user if not auth', async () => {
  const res = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);
  console.log(res.body.currentUser);
});
