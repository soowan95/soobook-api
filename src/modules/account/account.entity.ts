import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  VersionColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import Decimal from 'decimal.js';
import { Transaction } from '../transaction/transaction.entity';
import { Soobook } from '../../common/interfaces/soobook.entity';
import { Recurrence } from '../recurrence/recurrence.entity';

export enum AccountType {
  CASH = 'cash',
  SAVINGS_ACCOUNT = 'savingAccount',
  DEBIT_CARD = 'debitCard',
  CREDIT_CARD = 'creditCard',
  FUNDS = 'funds',
  INSURANCE = 'insurance',
}

@Entity()
export class Account extends Soobook {
  @ManyToOne(() => User, (user) => user.accounts, {
    cascade: ['remove'],
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 30 })
  name: string;

  @Column({ name: 'institution_name', nullable: true })
  institutionName: string;

  @Column({ nullable: true })
  number: string;

  @Column('enum', {
    enum: AccountType,
  })
  type: AccountType;

  @Column('decimal', {
    name: 'limit_amount',
    nullable: true,
    precision: 15,
    scale: 2,
  })
  limitAmount: Decimal;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ length: 30, nullable: true })
  description: string;

  @Column('decimal', {
    name: 'initial_balance',
    default: 0,
    precision: 15,
    scale: 2,
  })
  initialBalance: Decimal;

  @Column('decimal', { name: 'current_balance', precision: 15, scale: 2 })
  currentBalance: Decimal;

  @VersionColumn()
  version: number;

  @ManyToOne(() => Account, (account) => account.linkedCards)
  @JoinColumn({ name: 'linked_account_id' })
  linkedAccount: Account;

  @OneToMany(() => Account, (account) => account.linkedAccount)
  linkedCards: Account[];

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.toAccount)
  transferTransactions: Transaction[];

  @OneToMany(() => Recurrence, (recurrence) => recurrence.account)
  recurrences: Recurrence[];

  @OneToMany(() => Recurrence, (recurrence) => recurrence.toAccount)
  transferRecurrences: Recurrence[];
}
