import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersAndBooks } from './members-and-books.entity';
import { MembersAndBooksController } from './members-and-books.controller';
import { Member } from 'src/members/members.entity';
import { Book } from 'src/books/books.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, MembersAndBooks, Member])],
  controllers: [MembersAndBooksController],
  providers: [],
})
export class MembersAndBooksModule {}
