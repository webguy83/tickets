import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongo: any;

jest.mock('../nats-wrapper');

beforeAll(async () => {
  process.env.JWT_KEY = 'goobers';
  process.env.EXPIRATION_ORDER_SECONDS = '900';

  mongo = new MongoMemoryServer();
  const uri = await mongo.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let col of collections) {
    await col.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});
