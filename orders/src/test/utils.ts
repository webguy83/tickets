import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const getObjectId = new mongoose.Types.ObjectId().toHexString();

const getAuthCookie = () => {
  // build JWT payload { id, email}
  const payload = {
    id: mongoose.Types.ObjectId().toHexString(),
    email: 'nub@hothorse.com',
  };
  // create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // build session Object {jwt: tokendsfjhsfdsfsadfadsfasf}
  const session = {
    jwt: token,
  };
  // turn the session into JSON
  const sessJSON = JSON.stringify(session);
  // take JSON and encode it as base64
  const base64Session = Buffer.from(sessJSON).toString('base64');
  // return a string thats cookie with the encoded data
  return [`express:sess=${base64Session}`];
};

export { getAuthCookie, getObjectId };
