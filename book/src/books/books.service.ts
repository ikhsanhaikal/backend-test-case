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

  async findAll(): Promise<Array<any>> {
    const books = await this.booksRepository
      .createQueryBuilder('book')
      .select([
        'book.title as title',
        'book.code as code',
        'book.author as author',
      ])
      .leftJoin(MembersAndBooks, 'c', 'c.bookId = book.id')
      // .where('c.id IS NULL OR c.date_returned IS NOT NULL')
      // .orWhere('c.id IS NULL')
      // .addSelect('COUNT(book.code)', 'stock')
      .addSelect(
        'COUNT(CASE WHEN c.date_returned IS NOT NULL THEN 1 END)',
        'stock1',
      )
      .addSelect('COUNT(CASE WHEN c.id IS NULL THEN 1 END)', 'stock2')
      .groupBy('book.code')
      .addGroupBy('book.title')
      .addGroupBy('book.author')
      .getRawMany();
    return books.map(({ stock1, stock2, ...remaining }) => {
      return {
        ...remaining,
        stock: parseInt(stock1) + parseInt(stock2),
      };
    });
  }
}
