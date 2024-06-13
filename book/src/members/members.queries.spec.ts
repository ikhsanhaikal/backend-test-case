import { DataSource } from 'typeorm';
import { Member } from './members.entity';
import * as dotenv from 'dotenv';
import { Book } from 'src/books/books.entity';
import { MembersAndBooks } from 'src/members-and-books/members-and-books.entity';
dotenv.config({ path: `${process.cwd()}/.env` });

describe('Members Queries', () => {
  let dataSource: DataSource;
  beforeAll(async () => {
    // console.log('DATABASE_HOST', process.env.DATABASE_HOST);
    // console.log(`${process.cwd()}/.env`);
    // console.log(`${process.cwd()}/dist/**/*.entity.js`);
    // console.log(__dirname + '/../**/*.entity.{js,ts}');
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

  describe('findAll', () => {
    it('should return all members along with count field', async () => {
      const want = [
        { members_code: 'M001', current_book_borrowed: 1 },
        { members_code: 'M002', current_book_borrowed: 1 },
        { members_code: 'M003', current_book_borrowed: 1 },
      ];
      const membersRepository = dataSource.getRepository(Member);
      const result = await membersRepository
        .createQueryBuilder('members')
        .addSelect('COUNT(c.memberId)', 'current_book_borrowed')
        .where('c.date_returned IS NULL')
        .orWhere('c.id IS NULL')
        .leftJoin(MembersAndBooks, 'c', 'c.memberId = members.id')
        .groupBy('members.id')
        .getRawMany();

      want.forEach((m) => {
        const r = result.find((r) => r.members_code === m.members_code);
        expect(parseInt(r.current_book_borrowed)).toEqual(
          m.current_book_borrowed,
        );
      });
    });
  });

  describe('findOne', () => {
    it('should return a member along with the books', async () => {
      const member = await dataSource.getRepository(Member).findOne({
        where: { id: 1 },
      });
      const books = await dataSource
        .getRepository(MembersAndBooks)
        .createQueryBuilder('c')
        .select([
          'b.id as id',
          'b.title as title',
          'b.author as author',
          'b.code as code',
        ])
        .leftJoin(Member, 'm', 'm.id = c.memberId')
        .leftJoin(Book, 'b', 'b.id = c.bookId')
        .where('c.date_returned IS NULL')
        .andWhere('c.memberId = :memberId', { memberId: member.id })
        // .orWhere('c.date_returned IS NULL')
        .getRawMany();

      console.log('member: ', member);
      console.log('book: ', books);
    });
  });

  afterAll(async () => {
    await dataSource.destroy();
  });
});
