import { Member } from 'src/members/members.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'books' })
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  stock: number;

  @ManyToOne(() => Member, (user) => user.books)
  @JoinColumn({ name: 'member_id' })
  member: Member;
}
