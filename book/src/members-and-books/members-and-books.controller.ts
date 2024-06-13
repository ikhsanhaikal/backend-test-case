import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiPropertyOptional,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from 'src/members/members.entity';
import { Repository } from 'typeorm';
import { MembersAndBooks } from './members-and-books.entity';
import { Book } from 'src/books/books.entity';
import { IsDateString, IsOptional } from 'class-validator';
class DateForDebuggin {
  @IsOptional()
  @ApiPropertyOptional({
    description: 'untuk debugging pinjam diatas 3 hari penalized',
    nullable: true,
    default: null,
  })
  @IsDateString()
  future?: Date;
}
@Controller()
export class MembersAndBooksController {
  constructor(
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(MembersAndBooks)
    private membersAndBooksRepository: Repository<MembersAndBooks>,
  ) {}

  @ApiTags('Borrow')
  @Post('/:memberId/borrow/:bookCode')
  @ApiCreatedResponse()
  @ApiInternalServerErrorResponse()
  async borrow(
    @Param('bookCode') bookCode: string,
    @Param('memberId', ParseIntPipe) memberId: number,
    @Body()
    dateForDebuggin?: DateForDebuggin,
  ) {
    const currentTotalBookBorrowed = await this.membersAndBooksRepository
      .createQueryBuilder('c')
      .leftJoinAndSelect(Book, 'b', 'b.id = c.bookId')
      .where('c.memberId = :memberId', { memberId })
      .andWhere('c.date_returned IS NULL')
      .getRawMany();

    console.log('bookCode: ', bookCode);
    const books = await this.bookRepository
      .createQueryBuilder('books')
      .leftJoin(MembersAndBooks, 'c', 'c.bookId = books.id')
      .where('STRCMP(books.code, :bookCode) = 0', { bookCode })
      // .andWhere('c.id IS NULL or c.date_returned IS NOT NULL')
      .getMany();

    console.log('books: ', books);

    console.log('currentTotalBookBorrowed: ', currentTotalBookBorrowed);
    if (currentTotalBookBorrowed.length >= 2 || books.length < 1) {
      throw new BadRequestException(
        'Jumlah buku melebih batas / stock buku habis / kode buku salah',
      );
    }

    if (
      currentTotalBookBorrowed.length > 0 &&
      books.pop().code === currentTotalBookBorrowed.pop().b_code
    ) {
      throw new BadRequestException('Tidak boleh minjam buku yg sama dua kali');
    }

    let member = await this.membersRepository.findOne({
      where: { id: memberId },
    });

    if (!member) {
      throw new BadRequestException('member does not exist');
    }
    console.log('future: ', dateForDebuggin.future);
    const dateToday = dateForDebuggin?.future
      ? new Date(dateForDebuggin?.future)
      : new Date();
    console.log('penalized date > date today ');
    console.log(`${member.penalized} > ${dateToday}`);
    if (member.penalized && member.penalized >= dateToday) {
      throw new BadRequestException('penalized sampai batas tenggat waktu');
    } else if (member.penalized) {
      await this.membersRepository.update(
        { id: member.id },
        { penalized: null },
      );
      member = await this.membersRepository.findOne({
        where: { id: memberId },
      });
    }

    const book = books.pop();

    try {
      const date_borrowed = new Date();
      const buf = this.membersAndBooksRepository.create({
        book: {
          id: book.id,
        },
        member: {
          id: memberId,
        },
        date_borrowed,
      });
      await this.membersAndBooksRepository.save(buf);
      const books = await this.membersRepository
        .createQueryBuilder('m')
        .select([
          'b.id as id',
          'b.title as title',
          'b.code as code',
          'b.author as author',
        ])
        .leftJoin(MembersAndBooks, 'c', 'c.memberId = m.id')
        .leftJoin(Book, 'b', 'b.id = c.bookId')
        .where('c.date_returned is null')
        .andWhere('c.memberId = :memberId', { memberId })
        .getRawMany();
      return { ...member, books };
    } catch {
      throw new InternalServerErrorException();
    }
  }

  @ApiTags('Return Book')
  @Post('/:memberId/return/:bookId')
  @ApiOkResponse()
  async return(
    @Param('memberId', ParseIntPipe) memberId: number,
    @Param('bookId', ParseIntPipe) bookId: number,
  ) {
    const c = await this.membersAndBooksRepository
      .createQueryBuilder('c')
      .where('c.memberId = :memberId', { memberId })
      .andWhere('c.bookId = :bookId', { bookId })
      .andWhere('c.date_returned IS NULL')
      .getOne();

    if (!c) {
      throw new BadRequestException('book was not on your borrowed list');
    }

    const today = new Date();
    const diff = today.getTime() - c.date_borrowed.getTime();
    const diffInDays = Math.round(diff / (24 * 60 * 60 * 1000));
    let wasPenalized = false;

    if (diffInDays > 7) {
      const date_penalized = new Date(today.setDate(today.getDate() + 3));
      await this.membersRepository.update(
        {
          id: memberId,
        },
        {
          penalized: date_penalized,
        },
      );
      wasPenalized = true;
    }

    await this.membersAndBooksRepository.update(
      {
        id: c.id,
      },
      { date_returned: today },
    );

    return { message: `success return, penalize: ${wasPenalized}` };
  }
}
