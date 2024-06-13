import { MembersAndBooks } from 'src/members-and-books/members-and-books.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'members' })
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  penalized: Date;

  @OneToMany(() => MembersAndBooks, (memberAndBook) => memberAndBook.member)
  public memberAndBook: MembersAndBooks[];
}
