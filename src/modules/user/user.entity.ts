import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RefreshToken } from '../auth/refresh-token.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ name: 'phone_no', length: 20 })
  @Index()
  phoneNo: string;

  @Column({ length: 10 })
  name: string;

  @Column({ length: 10, nullable: true })
  nickname: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.GUEST,
  })
  role: UserRole;

  @Column({ name: 'token_version', default: 0 })
  tokenVersion: number;

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.user, {
    onDelete: 'CASCADE',
  })
  refreshToken: RefreshToken;

  @BeforeInsert()
  setDaultNickName() {
    if (!this.nickname) {
      this.nickname = this.name;
    }
  }
}
