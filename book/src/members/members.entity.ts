import { Book } from 'src/books/books.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'members' })
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  name: string;

  @OneToMany(() => Book, (book) => book.member, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  books: Array<Book>;
}
