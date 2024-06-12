import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { Member } from './members/members.entity';
import { Book } from './books/books.entity';

async function seeding(dataSource: DataSource) {
  const memberRepository = dataSource.getRepository(Member);
  const booksRepository = dataSource.getRepository(Book);

  await Promise.all(
    (await memberRepository.find()).map((member) =>
      memberRepository.delete(member),
    ),
  );

  await Promise.all(
    (await booksRepository.find()).map((book) => booksRepository.delete(book)),
  );

  const membersSeed = [
    {
      code: 'M001',
      name: 'Angga',
    },
    {
      code: 'M002',
      name: 'Ferry',
    },
    {
      code: 'M003',
      name: 'Putri',
    },
  ];
  const booksSeed = [
    {
      code: 'JK-45',
      title: 'Harry Potter',
      author: 'J.K Rowling',
      stock: 1,
    },
    {
      code: 'SHR-1',
      title: 'A Study in Scarlet',
      author: 'Arthur Conan Doyle',
      stock: 1,
    },
    {
      code: 'TW-11',
      title: 'Twilight',
      author: 'Stephenie Meyer',
      stock: 1,
    },
    {
      code: 'HOB-83',
      title: 'The Hobbit, or There and Back Again',
      author: 'J.R.R. Tolkien',
      stock: 1,
    },
    {
      code: 'NRN-7',
      title: 'The Lion, the Witch and the Wardrobe',
      author: 'C.S. Lewis',
      stock: 1,
    },
  ];
  const t1 = membersSeed.map(({ name, code }) => {
    return memberRepository.create({
      name: name,
      code: code,
    });
  });

  const t2 = booksSeed.map(({ title, code, author, stock }) => {
    return booksRepository.create({
      title,
      author,
      stock,
      code,
    });
  });

  await memberRepository.save(t1);
  await booksRepository.save(t2);
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
