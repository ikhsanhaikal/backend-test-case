import { Injectable } from '@nestjs/common';
import { Book } from './books.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MembersAndBooks } from 'src/members-and-books/members-and-books.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  async findAll(): Promise<Array<Book>> {
    const books = await this.booksRepository
      .createQueryBuilder('books')
      .select('books.title', 'title')
      .addSelect('books.code', 'code')
      .addSelect('books.author', 'author')
      .leftJoin(MembersAndBooks, 'c', 'c.bookId = books.id')
      // .where('c.id IS NULL')
      .addSelect('COUNT(CASE WHEN c.bookId IS NULL THEN 1 END)', 'stock')
      .groupBy('books.code')
      .addGroupBy('books.title')
      .addGroupBy('books.author')
      .getRawMany();

    return books;
  }
}
