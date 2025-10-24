import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { User } from '../user/user.entity';
import Decimal from 'decimal.js';
import { Transaction } from '../transaction/transaction.entity';
import { Soobook } from '../../common/interfaces/soobook.entity';

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
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 30 })
  name: string;

  @Column({ name: 'institution_name', nullable: true })
  institutionName: string;

  @Column({ nullable: true })
  number: string;

  @Column({
    type: 'enum',
    enum: AccountType,
  })
  type: AccountType;

  @Column('tinyint', { name: 'payment_day', nullable: true, unsigned: true })
  paymentDay: number;

  @Column('decimal', { nullable: true, precision: 15, scale: 2 })
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

  @OneToOne(() => Account, (account) => account.linkedCard)
  @JoinColumn({ name: 'linked_account_id' })
  linkedAccount: Account;

  @OneToOne(() => Account, (account) => account.linkedAccount)
  linkedCard: Account;

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[];
}
