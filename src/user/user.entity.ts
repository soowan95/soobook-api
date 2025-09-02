import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ name: 'phone_no', length: 20 })
  phoneNo: string;

  @Column({ length: 10 })
  name: string;

  @Column({ length: 10, nullable: true })
  nickname: string;

  @BeforeInsert()
  setDaultNickName() {
    if (!this.nickname) {
      this.nickname = this.name;
    }
  }
}
