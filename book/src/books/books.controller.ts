import { Controller, Get } from '@nestjs/common';
import { Book } from './books.entity';
import { ApiInternalServerErrorResponse, ApiResponse } from '@nestjs/swagger';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}
  @Get()
  @ApiResponse({
    status: 200,
    description: 'All is well',
    isArray: true,
    type: Book,
  })
  @ApiInternalServerErrorResponse()
  async findAll(): Promise<Array<Book>> {
    return this.booksService.findAll();
  }
}
