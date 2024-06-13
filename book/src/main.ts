import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { Member } from './members/members.entity';
import { Book } from './books/books.entity';
import { membersSeed, booksSeed } from './seed.data';
import { MembersAndBooks } from './members-and-books/members-and-books.entity';

async function seeding(dataSource: DataSource) {
  const memberRepository = dataSource.getRepository(Member);
  const booksRepository = dataSource.getRepository(Book);
  const membersAndBook = dataSource.getRepository(MembersAndBooks);

  await Promise.all(
    (await memberRepository.find()).map((member) =>
      memberRepository.delete({ id: member.id }),
    ),
  );

  await Promise.all(
    (await booksRepository.find()).map((book) =>
      booksRepository.delete({ id: book.id }),
    ),
  );

  const t1 = membersSeed.map(({ name, code }) => {
    return memberRepository.create({
      name: name,
      code: code,
    });
  });

  const t2 = booksSeed.flatMap(({ title, code, author, stock }) => {
    return Array.from(Array(stock).keys()).map(() => {
      return booksRepository.create({
        title,
        author,
        code,
      });
    });
  });

  const m = await memberRepository.save(t1);
  const b = await booksRepository.save(t2);

  await membersAndBook.save(
    m.map((member) => {
      return membersAndBook.create({
        book: {
          id: b.pop().id,
        },
        member: {
          id: member.id,
        },
        date_borrowed: new Date(),
      });
    }),
  );
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Books')
    .setDescription('Books Backend Test Case Api')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const dataSource = app.get(DataSource);
  await seeding(dataSource);
  await app.listen(3000);
}
bootstrap();
