import { Book } from 'src/books/books.entity';
import { Member } from 'src/members/members.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'membersandbooks' })
export class MembersAndBooks {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ nullable: true })
  public date_returned: Date;

  @Column()
  public date_borrowed: Date;

  @ManyToOne(() => Member, (member) => member.memberAndBook, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  public member: Member;

  @ManyToOne(() => Book, (book) => book.memberAndBook, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  public book: Book;
}
