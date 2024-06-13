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

  it('borrow', async () => {
    const want = [
      { members_code: 'M001', current_book_borrowed: 1 },
      { members_code: 'M002', current_book_borrowed: 1 },
      { members_code: 'M003', current_book_borrowed: 1 },
    ];
  });

  it('return ok', async () => {});
  afterAll(async () => {
    await dataSource.destroy();
  });

  it('return penalized', async () => {});

  afterAll(async () => {
    await dataSource.destroy();
  });
});
