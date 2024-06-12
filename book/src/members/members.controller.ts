import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { Member } from './members.entity';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { MembersService } from './members.service';

@Controller({ path: 'members' })
export class MembersController {
  constructor(private membersService: MembersService) {}

  @ApiOkResponse()
  @ApiInternalServerErrorResponse()
  async findAll(): Promise<Member[] | null> {
    try {
      return await this.membersService.findAll();
    } catch (error) {
      return null;
    }
  }

  @Get(':id')
  @ApiOkResponse()
  @ApiInternalServerErrorResponse()
  @ApiNotFoundResponse({ description: 'No member was found given the id' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Member | null> {
    try {
      return await this.membersService.findOne(id);
    } catch (error) {
      return null;
    }
  }
}
