import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from 'src/members/members.entity';
import { Repository } from 'typeorm';
import { MembersAndBooks } from './members-and-books.entity';
import { Book } from 'src/books/books.entity';

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
  @Get(':memberId/:bookCode')
  @ApiOkResponse()
  @ApiInternalServerErrorResponse()
  async borrow(
    @Param('bookCode', ParseIntPipe) bookCode: string,
    @Param('memberId', ParseIntPipe) memberId: number,
  ): Promise<Member | null> {
    const currentTotalBookBorrowed = await this.membersAndBooksRepository
      .createQueryBuilder('c')
      .where('c.memberId = :memberId', { memberId })
      .andWhere('c.date_returned IS NOT NULL')
      .getCount();

    const books = await this.bookRepository
      .createQueryBuilder('books')
      .leftJoin(MembersAndBooks, 'c', 'c.bookId = books.id')
      .where('c.bookCode = :bookCode', { bookCode })
      .andWhere('c.id IS NULL')
      .orWhere('c.date_returned IS NOT NULL')
      .getMany();

    if (currentTotalBookBorrowed >= 2 || books.length < 1) {
      throw new BadRequestException(
        'Jumlah buku melebih batas / stock buku habis',
      );
    }

    const member = await this.membersRepository.findOne({
      where: { id: memberId },
    });

    if (member.penalized && member.penalized > new Date()) {
      throw new BadRequestException('penalized sampai batas tenggat waktu');
    } else if (member.penalized) {
      await this.membersRepository.update(
        { penalized: null },
        { id: member.id },
      );
    }

    const book = books.pop();

    try {
      const date_borrowed = new Date();
      const date_returned = new Date(
        date_borrowed.setDate(date_borrowed.getDate() + 3),
      );
      const buf = this.membersAndBooksRepository.create({
        book: {
          id: book.id,
        },
        member: {
          id: memberId,
        },
        date_borrowed,
        date_returned,
      });
      const data = await this.membersAndBooksRepository.save(buf);
      const member = await this.membersRepository.findOne({
        relations: {
          memberAndBook: {
            book: true,
          },
        },
        where: {
          id: data.member.id,
        },
      });
      return member;
    } catch {
      throw new InternalServerErrorException();
    }
  }

  @ApiTags('Return Book')
  @Get(':memberId/:bookId')
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

    const today = new Date();
    const diff = today.getTime() - c.date_borrowed.getTime();
    const diffInDays = Math.floor((diff / 24) * 60 * 60 * 1000);
    let wasPenalized = false;
    if (diffInDays > 7) {
      const date_penalized = new Date(today.setDate(today.getDate() + 3));
      await this.membersRepository.update(
        {
          penalized: date_penalized,
        },
        {
          id: memberId,
        },
      );
      wasPenalized = true;
    }

    await this.membersAndBooksRepository.update(
      {
        date_returned: today,
      },
      { id: c.id },
    );

    return { message: `success return, penalize: ${wasPenalized}` };
  }
}
