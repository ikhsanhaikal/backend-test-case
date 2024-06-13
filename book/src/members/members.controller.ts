import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  // NotFoundException,
  // Param,
  // ParseIntPipe,
} from '@nestjs/common';
import { Member } from './members.entity';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  // ApiNotFoundResponse,
  ApiOkResponse,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { MembersService } from './members.service';
import { Book } from 'src/books/books.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MembersAndBooks } from 'src/members-and-books/members-and-books.entity';
class GetMemberByIdResponse {
  @ApiProperty({ description: 'the member based on id' })
  member: Member;
  @ApiProperty()
  @ApiProperty({
    description: 'borrowed book still active based on the member id',
  })
  books: Book[];
}
@Controller({ path: 'members' })
export class MembersController {
  constructor(
    @InjectRepository(MembersAndBooks)
    private membersAndBooks: Repository<MembersAndBooks>,
    private membersService: MembersService,
  ) {}

  @ApiTags('List all members along with their books')
  @Get()
  @ApiOkResponse({ description: 'ok' })
  @ApiInternalServerErrorResponse({ description: 'server crash' })
  async findAll(): Promise<Member[] | null> {
    const response = await this.membersService.findAll();
    return response;
  }

  @ApiTags('Get a member by id along with current borrowed books')
  @Get(':id')
  @ApiOkResponse({
    description: 'Member yang dicari exist dan dikembalikan',
    type: GetMemberByIdResponse,
  })
  @ApiNotFoundResponse({ description: 'No member was found given the id' })
  @ApiInternalServerErrorResponse({
    description: 'server crash',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const member = await this.membersService.findOne(id);
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
    const books = await this.membersAndBooks
      .createQueryBuilder('c')
      .select(['b.id', 'b.title', 'b.author', 'b.code'])
      .leftJoin(Member, 'm', 'm.id = c.memberId')
      .leftJoin(Book, 'b', 'b.id = c.bookId')
      .where('c.memberId = :memberId', { memberId: member.id })
      .andWhere('c.date_returned IS NULL')
      .getRawMany();

    return { ...member, books };
  }
}
