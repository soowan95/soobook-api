import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Soobook } from '../../common/interfaces/soobook.entity';
import { User } from '../user/user.entity';
import { Account } from '../account/account.entity';
import Decimal from 'decimal.js';
import { TransactionType } from '../transaction/transaction-type.enum';
import { Transaction } from '../transaction/transaction.entity';

export enum RecurrencePeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

@Entity()
export class Recurrence extends Soobook {
  @ManyToOne(() => User, (user) => user.recurrences, {
    cascade: ['remove'],
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Account, (account) => account.recurrences, {
    cascade: ['remove'],
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @OneToMany(() => Transaction, (transaction) => transaction.recurrence)
  transactions: Transaction[];

  @Column('decimal', { precision: 15, scale: 2 })
  amount: Decimal;

  @Column('enum', { enum: TransactionType })
  type: TransactionType;

  @Column('enum', { enum: RecurrencePeriod })
  period: RecurrencePeriod;

  @Column()
  executeDay: number;

  @Column('timestamp', { name: 'due_date', nullable: true })
  dueDate: Date;
}
