import { ApiHideProperty } from '@nestjs/swagger';
import { MembersAndBooks } from 'src/members-and-books/members-and-books.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  // @Column()
  // stock: number;

  @ApiHideProperty()
  @OneToMany(() => MembersAndBooks, (memberAndBook) => memberAndBook.book)
  public memberAndBook: MembersAndBooks[];
}
