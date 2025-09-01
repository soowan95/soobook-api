import { Entity, Column, PrimaryColumn, BeforeInsert } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  email: string;

  @Column('text')
  password: string;

  @Column('text')
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
