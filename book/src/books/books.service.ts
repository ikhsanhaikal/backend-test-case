import { Injectable } from '@nestjs/common';
import { Book } from './books.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  async findAll(): Promise<Array<Book>> {
    return await this.booksRepository.find({});
  }
}
