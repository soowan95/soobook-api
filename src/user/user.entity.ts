import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  email: string;

  @Column('text')
  password: string;

  @Column('text')
  phoneNo: string;

  @Column({ length: 10 })
  name: string;

  @Column({ length: 10 })
  nickname: string;
}
