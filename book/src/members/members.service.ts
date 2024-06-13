import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './members.entity';
import { Repository } from 'typeorm';
import { MembersAndBooks } from 'src/members-and-books/members-and-books.entity';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
  ) {}

  async findAll(): Promise<Member[]> {
    const memberAlongWithTheirBorrowedBooks = await this.membersRepository
      .createQueryBuilder('members')
      .select([
        'members.id as id',
        'members.code as code',
        'members.name as name',
        'members.penalized as penalized',
      ])
      .addSelect(
        'COUNT(CASE WHEN c.date_returned IS NULL THEN 1 END)',
        'current_book_borrowed',
      )
      .leftJoin(MembersAndBooks, 'c', 'c.memberId = members.id')
      // .where('c.date_returned IS NULL')
      .groupBy('members.id')
      .getRawMany();

    return memberAlongWithTheirBorrowedBooks;
  }

  async findOne(id: number): Promise<Member | null> {
    const member = await this.membersRepository.findOne({ where: { id: id } });
    return member;
  }
}
