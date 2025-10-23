import {
  Column,
  Entity,
  Index,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  BeforeUpdate,
} from 'typeorm';
import { RefreshToken } from '../auth/refresh-token.entity';
import { nanoid } from 'nanoid';
import { Transaction } from '../transaction/transaction.entity';
import { requestContext } from '../../common/middlewares/request-context';

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

  @Column({ name: 'updated_ip', nullable: true })
  updatedIp: string;

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.user, {
    onDelete: 'CASCADE',
  })
  refreshToken: RefreshToken;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @BeforeUpdate()
  setUpdatedIp() {
    const store = requestContext.getStore();
    if (store?.ip) {
      this.updatedIp = store.ip;
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
