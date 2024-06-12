import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './members.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
  ) {}

  async findAll(): Promise<Member[]> {
    return await this.membersRepository.find({});
  }

  async findOne(id: number): Promise<Member | null> {
    const member = await this.membersRepository.findOne({ where: { id: id } });
    return member;
  }
}
