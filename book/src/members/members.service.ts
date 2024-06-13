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
      .addSelect('COUNT(c.memberId)', 'current_book_borrowed')
      .where('c.date_returned IS NULL')
      .orWhere('c.id IS NULL')
      .leftJoin(MembersAndBooks, 'c', 'c.memberId = members.id')
      .groupBy('members.id')
      .getRawMany();

    return memberAlongWithTheirBorrowedBooks;
  }

  async findOne(id: number): Promise<Member | null> {
    const member = await this.membersRepository.findOne({ where: { id: id } });
    return member;
  }
}
