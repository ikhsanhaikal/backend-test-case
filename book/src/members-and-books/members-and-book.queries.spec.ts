import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config({ path: `${process.cwd()}/.env` });

describe('Members Queries', async () => {
  let dataSource: DataSource;
  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE,
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      dropSchema: false,
      synchronize: false,
    });
    await dataSource.initialize();
  });

  describe('borrow', () => {
    it('borrow from 0 books to 1', async () => {});

    it('borrow when over capacity 2', async () => {});
  });

  describe('return', () => {
    it('return not penalize', async () => {});

    it('return over 7 days', async () => {});
  });

  afterAll(async () => {
    await dataSource.destroy();
  });
});
