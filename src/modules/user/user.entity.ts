import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RefreshToken } from '../auth/refresh-token.entity';
import { nanoid } from 'nanoid';

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

  @Column({ length: 15 })
  name: string;

  @Column({ length: 15, unique: true })
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

  static generateGuest(): {
    email: string;
    password: string;
    phoneNo: string;
    name: string;
    nickname: string;
  } {
    const guestId = `Guest_${nanoid(8)}`;

    return {
      email: `${guestId}@guest.soobook`,
      password: nanoid(),
      phoneNo: '01000000000',
      name: guestId,
      nickname: guestId,
    };
  }
}
