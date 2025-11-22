import { Column, Entity, Index, OneToMany, OneToOne } from 'typeorm';
import { RefreshToken } from '../auth/refresh-token.entity';
import { nanoid } from 'nanoid';
import { Transaction } from '../transaction/transaction.entity';
import { Account } from '../account/account.entity';
import { Soobook } from '../../common/interfaces/soobook.entity';
import { Recurrence } from '../recurrence/recurrence.entity';
import { UserSetting } from '../userSetting/user-setting.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

@Entity()
export class User extends Soobook {
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

  @Column('enum', {
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

  @OneToOne(() => UserSetting, (setting) => setting.user)
  setting: UserSetting;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => Account, (account) => account.user)
  accounts: Account[];

  @OneToMany(() => Recurrence, (recurrence) => recurrence.user)
  recurrences: Recurrence[];

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
