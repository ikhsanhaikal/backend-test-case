import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { Book } from './books.entity';
import {
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @ApiTags('List all available books')
  @Get()
  @ApiResponse({
    status: 200,
    description: 'All is well',
    isArray: true,
    type: Book,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async findAll(): Promise<Array<Book>> {
    try {
      const groupByCode = this.booksService.findAll();
      return groupByCode;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
