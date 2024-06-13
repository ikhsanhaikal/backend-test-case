import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './members.entity';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { MembersAndBooks } from 'src/members-and-books/members-and-books.entity';
import { Book } from 'src/books/books.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Member, MembersAndBooks, Book])],
  controllers: [MembersController],
  providers: [MembersService],
})
export class MembersModule {}
